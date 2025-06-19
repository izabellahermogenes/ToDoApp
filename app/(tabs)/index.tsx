import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  mood: 'easy wins' | 'urgent' | 'someday';
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'finish design portfolio', completed: false, mood: 'urgent' },
    { id: 2, text: 'check visa requirements', completed: true, mood: 'easy wins' },
    { id: 3, text: 'do recital checklist', completed: false, mood: 'someday' }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [selectedMood, setSelectedMood] = useState<'easy wins' | 'urgent' | 'someday'>('easy wins');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showInput, setShowInput] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        mood: selectedMood,
      };
      setTodos([...todos, todo]);
      setNewTodo('');
      setShowInput(false);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'urgent': return '‼️';
      case 'easy wins': return '✨';
      case 'someday': return '💭';
      default: return '✨';
    }
  };

  const getMoodText = (mood: string) => {
    switch (mood) {
      case 'urgent': return 'urgent';
      case 'easy wins': return 'easy wins';
      case 'someday': return 'someday';
      default: return 'easy wins';
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active': return todos.filter(todo => !todo.completed);
      case 'completed': return todos.filter(todo => todo.completed);
      default: return todos;
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Simple Progress Circle without SVG
  const ProgressCircle = ({ percentage }: { percentage: number }) => {
    // Convert percentage to degrees
    const degrees = (percentage / 100) * 360;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressCircleBase}>
          {/* Background circle */}
          <View style={styles.progressBackground} />
          
          {/* Progress fill */}
          {percentage > 0 && (
            <>
              {/* First half (0% to 50%) */}
              <View style={[
                styles.progressHalf,
                styles.leftHalf,
                {
                  transform: [
                    { rotate: `${Math.min(degrees, 180)}deg` }
                  ]
                }
              ]} />
              
              {/* Second half (50% to 100%) */}
              {degrees > 180 && (
                <View style={[
                  styles.progressHalf,
                  styles.rightHalf,
                  {
                    transform: [
                      { rotate: `${degrees - 180}deg` }
                    ]
                  }
                ]} />
              )}
              
              {/* Full circle overlay for 100% */}
              {percentage === 100 && (
                <View style={styles.fullProgressOverlay} />
              )}
            </>
          )}
        </View>
        
        <View style={styles.progressTextWrapper}>
          <Text style={styles.progressText}>{percentage}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>today's focus</Text>
          <Text style={styles.subtitle}>simple tasks, clear mind</Text>
        </View>

        {/* Progress Circle */}
        <ProgressCircle percentage={completionPercentage} />

        {/* Mood Filters */}
        <View style={styles.moodFilters}>
          <TouchableOpacity 
            style={[styles.moodFilter, selectedMood === 'easy wins' && styles.selectedMoodFilter]}
            onPress={() => setSelectedMood('easy wins')}
          >
            <Text style={styles.moodFilterText}>✨ easy wins</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.moodFilter, selectedMood === 'urgent' && styles.selectedMoodFilter]}
            onPress={() => setSelectedMood('urgent')}
          >
            <Text style={styles.moodFilterText}>‼️ urgent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.moodFilter, selectedMood === 'someday' && styles.selectedMoodFilter]}
            onPress={() => setSelectedMood('someday')}
          >
            <Text style={styles.moodFilterText}>💭 someday</Text>
          </TouchableOpacity>
        </View>

        {/* Add Todo Input */}
        <View style={styles.inputContainer}>
          {showInput ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="what's on your mind?"
                placeholderTextColor="#a0a0a0"
                autoFocus
                onSubmitEditing={addTodo}
              />
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowInput(false)}>
                <Text style={styles.cancelButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowInput(true)}>
              <Text style={styles.addButtonText}>what's on your mind?</Text>
              <View style={styles.plusIcon}>
                <Text style={styles.plusText}>+</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>all</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'active' && styles.activeFilterTab]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterTabText, filter === 'active' && styles.activeFilterTabText]}>active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'completed' && styles.activeFilterTab]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterTabText, filter === 'completed' && styles.activeFilterTabText]}>completed</Text>
          </TouchableOpacity>
        </View>

        {/* Todos List */}
        <View style={styles.todosList}>
          {getFilteredTodos().map((todo) => (
            <View key={todo.id} style={styles.todoItem}>
              <TouchableOpacity
                style={styles.todoContent}
                onPress={() => toggleTodo(todo.id)}
              >
                <View style={[
                  styles.checkbox,
                  todo.completed && styles.checkedBox
                ]}>
                  {todo.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                
                <View style={styles.todoInfo}>
                  <View style={styles.todoMeta}>
                    <Text style={styles.moodIcon}>{getMoodEmoji(todo.mood)}</Text>
                    <Text style={styles.moodLabel}>{getMoodText(todo.mood)}</Text>
                  </View>
                  <Text style={[
                    styles.todoText,
                    todo.completed && styles.completedText
                  ]}>
                    {todo.text}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTodo(todo.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Stats */}
        <Text style={styles.stats}>
          {completedCount} of {totalCount} tasks completed
        </Text>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '400',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  progressCircleBase: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  progressBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#e2e8f0',
    position: 'absolute',
  },
  progressHalf: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: 'transparent',
  },
  leftHalf: {
    borderTopColor: '#4a5568',
    borderRightColor: '#4a5568',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
  rightHalf: {
    borderTopColor: '#4a5568',
    borderLeftColor: '#4a5568',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '90deg' }],
  },
  fullProgressOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#4a5568',
  },
  progressTextWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
  },
  moodFilters: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  moodFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f7fafc',
  },
  selectedMoodFilter: {
    backgroundColor: '#e2e8f0',
  },
  moodFilterText: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4a5568',
  },
  cancelButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 20,
    color: '#a0aec0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addButtonText: {
    fontSize: 16,
    color: '#a0aec0',
  },
  plusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2d3748',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '300',
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 32,
  },
  filterTab: {
    paddingVertical: 8,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2d3748',
  },
  filterTabText: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#2d3748',
    fontWeight: '600',
  },
  todosList: {
    marginBottom: 40,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkedBox: {
    backgroundColor: '#4a5568',
    borderColor: '#4a5568',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  todoInfo: {
    flex: 1,
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  moodIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '500',
  },
  todoText: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#a0aec0',
  },
  deleteButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#e2e8f0',
    fontWeight: '300',
  },
  stats: {
    textAlign: 'center',
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  activeDot: {
    backgroundColor: '#2d3748',
  },
});

export default TodoApp;