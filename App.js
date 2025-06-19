import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedMood, setSelectedMood] = useState('vibe');
  const [filter, setFilter] = useState('all');

  const moods = {
    vibe: { icon: 'sparkles', color: '#6b7280', bg: '#f3f4f6', label: '✨ vibe check' },
    fire: { icon: 'flame', color: '#dc2626', bg: '#fef2f2', label: '🔥 urgent' },
    someday: { icon: 'cloud', color: '#78716c', bg: '#f5f5f4', label: '💭 someday' }
  };

  // Load todos from AsyncStorage on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem('todos');
        if (savedTodos !== null) {
          setTodos(JSON.parse(savedTodos));
        } else {
          setTodos([
            { id: 1, text: 'finish design portfolio', completed: false, mood: 'fire', priority: 'high' },
            { id: 2, text: 'call mom back', completed: true, mood: 'vibe', priority: 'medium' },
            { id: 3, text: 'learn that new framework', completed: false, mood: 'someday', priority: 'low' }
          ]);
        }
      } catch (e) {
        console.error('Failed to load todos', e);
      }
    };

    loadTodos();
  }, []);

  // Save todos to AsyncStorage
  const saveTodos = async (newTodos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
      const updatedTodos = [
        ...todos,
        {
          id: newId,
          text: newTodo.trim(),
          completed: false,
          mood: selectedMood,
          priority: 'medium'
        }
      ];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const ProgressRing = ({ percentage }) => {
    const radius = 35;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg width={80} height={80} style={styles.progressRing}>
          <Circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#6b7280"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 40 40)`}
          />
        </Svg>
        <View style={styles.progressText}>
          <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#f9fafb', '#f3f4f6', '#f5f5f4']}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>today's focus</Text>
            <Text style={styles.subtitle}>simple tasks, clear mind</Text>
          </View>

          {/* Progress Ring */}
          <View style={styles.progressSection}>
            <ProgressRing percentage={progressPercentage} />
          </View>

          {/* Add Todo */}
          <BlurView intensity={20} style={styles.addTodoContainer}>
            <View style={styles.moodButtons}>
              {Object.entries(moods).map(([key, mood]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedMood(key)}
                  style={[
                    styles.moodButton,
                    selectedMood === key && { backgroundColor: mood.bg }
                  ]}
                >
                  <Text style={[
                    styles.moodButtonText,
                    selectedMood === key && { color: mood.color }
                  ]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="what's on your mind?"
                placeholderTextColor="#9ca3af"
                onSubmitEditing={addTodo}
              />
              <TouchableOpacity onPress={addTodo} style={styles.addButton}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Filter Tabs */}
          <BlurView intensity={15} style={styles.filterContainer}>
            {['all', 'active', 'completed'].map((filterType) => (
              <TouchableOpacity
                key={filterType}
                onPress={() => setFilter(filterType)}
                style={[
                  styles.filterButton,
                  filter === filterType && styles.activeFilter
                ]}
              >
                <Text style={[
                  styles.filterText,
                  filter === filterType && styles.activeFilterText
                ]}>
                  {filterType}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>

          {/* Todo List */}
          <View style={styles.todoList}>
            {filteredTodos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌸</Text>
                <Text style={styles.emptyText}>nothing here yet</Text>
                <Text style={styles.emptySubtext}>time to add some tasks</Text>
              </View>
            ) : (
              filteredTodos.map((todo) => (
                <BlurView key={todo.id} intensity={20} style={styles.todoItem}>
                  <View style={styles.todoContent}>
                    <TouchableOpacity
                      onPress={() => toggleTodo(todo.id)}
                      style={[
                        styles.checkbox,
                        todo.completed && styles.checkedBox
                      ]}
                    >
                      {todo.completed && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.todoTextContainer}>
                      <View style={styles.moodIndicator}>
                        <Ionicons 
                          name={moods[todo.mood].icon} 
                          size={14} 
                          color={moods[todo.mood].color} 
                        />
                        <View style={[styles.moodTag, { backgroundColor: moods[todo.mood].bg }]}>
                          <Text style={[styles.moodTagText, { color: moods[todo.mood].color }]}>
                            {moods[todo.mood].label}
                          </Text>
                        </View>
                      </View>
                      <Text style={[
                        styles.todoText,
                        todo.completed && styles.completedText
                      ]}>
                        {todo.text}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => deleteTodo(todo.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="close" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              ))
            )}
          </View>

          {/* Stats */}
          {todos.length > 0 && (
            <View style={styles.stats}>
              <Text style={styles.statsText}>
                {completedCount} of {totalCount} tasks completed
              </Text>
              <Text style={styles.progressDots}>
                {'●'.repeat(Math.min(Math.floor(progressPercentage / 20), 5))}
                {'○'.repeat(5 - Math.min(Math.floor(progressPercentage / 20), 5))}
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
  },
  progressText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  addTodoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  moodButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
  },
  moodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    borderRadius: 16,
    fontSize: 16,
    color: '#374151',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#374151',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.3)',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: 'white',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  activeFilterText: {
    color: '#374151',
  },
  todoList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
  },
  todoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.3)',
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#374151',
    borderColor: '#374151',
  },
  todoTextContainer: {
    flex: 1,
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  todoText: {
    fontSize: 16,
    color: '#374151',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 16,
  },
  stats: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  statsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  progressDots: {
    fontSize: 16,
    color: '#6b7280',
    letterSpacing: 2,
  },
});

export default TodoApp;

