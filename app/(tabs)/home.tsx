import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

type Task = {
  id: number;
  title: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  done: boolean;
  date: Date;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    time: string;
    priority: Task['priority'];
  }>({
    title: '',
    time: '',
    priority: 'medium'
  });
  const [filterType, setFilterType] = useState<'pending' | 'completed' | 'all'>('pending');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Reunião de Equipe', time: '09:00', priority: 'high', done: false, date: new Date() },
    { id: 2, title: 'Enviar Relatório', time: '11:00', priority: 'medium', done: true, date: new Date() },
    { id: 3, title: 'Almoço com Cliente', time: '13:00', priority: 'low', done: false, date: new Date() },
  ]);

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => router.replace('/login') }
      ]
    );
  };

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.time.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    
    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      time: newTask.time,
      priority: newTask.priority,
      done: false,
      date: new Date()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', time: '', priority: 'medium' });
    setIsModalVisible(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: 'short'
    });
  };

  const getFilteredTasks = useCallback(() => {
    return tasks.filter(task => {
      const taskDay = task.date.getDay();
      const dayMatches = taskDay === selectedDay;
      const dateMatches = task.date.toDateString() === selectedDate.toDateString();
      
      switch (filterType) {
        case 'pending':
          return dayMatches && dateMatches && !task.done;
        case 'completed':
          return dayMatches && dateMatches && task.done;
        default:
          return dayMatches && dateMatches;
      }
    });
  }, [tasks, selectedDay, selectedDate, filterType]);

  const filteredTasks = getFilteredTasks();

  const getPriorityColor = (priority: Task['priority']) => {
    const colors: Record<Task['priority'], string> = {
      high: '#FF4D4F',
      medium: '#FFA940',
      low: '#52C41A'
    };
    return colors[priority];
  };

  const getFilterColor = (type: 'pending' | 'completed' | 'all') => {
    const colors = {
      pending: '#FFA940', // Laranja para pendentes
      completed: '#52C41A', // Verde para concluídas
      all: '#007AFF', // Azul para todas
    };
    return colors[type];
  };

  // Estilos dinâmicos que dependem do isDark
  const dynamicStyles = {
    modalHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#eee',
    },
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header existente */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.greeting}>Tarefas Diárias</ThemedText>
          <ThemedText style={styles.date}>{new Date().toLocaleDateString()}</ThemedText>
        </View>
        <TouchableOpacity style={styles.profileIcon} onPress={handleLogout}>
          <MaterialIcons name="logout" size={32} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Calendar Strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarStrip}>
        {weekDays.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.selectedDay,
              isDark && styles.dayButtonDark
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <ThemedText style={[
              styles.dayText,
              selectedDay === index && styles.selectedDayText
            ]}>
              {day}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filters Container */}
      <View style={styles.filtersRow}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filtersStrip}
        >
          {[
            { type: 'pending', label: 'Pendentes', icon: 'timer' as const },
            { type: 'completed', label: 'Concluídas', icon: 'check-circle' as const },
            { type: 'all', label: 'Todas', icon: 'format-list-bulleted' as const }
          ].map(({ type, label, icon }) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                isDark && styles.filterChipDark,
                filterType === type && {
                  backgroundColor: type === 'pending' ? '#FFA940' : 
                                 type === 'completed' ? '#52C41A' : '#007AFF'
                }
              ]}
              onPress={() => setFilterType(type as typeof filterType)}
            >
              <MaterialIcons
                name={icon}
                size={16}
                color={filterType === type ? '#FFF' : (isDark ? '#8F8F8F' : '#666')}
              />
              <ThemedText style={[
                styles.filterChipText,
                filterType === type && styles.filterChipTextActive
              ]}>
                {label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tasks List atualizado */}
      <ScrollView style={styles.tasksContainer}>
        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Hoje</ThemedText>
          <ThemedText>{filteredTasks.length} tarefas</ThemedText>
        </View>

        {filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, isDark && styles.taskCardDark]}
            onPress={() => handleToggleTask(task.id)}
          >
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <ThemedText type="defaultSemiBold" style={[
                  styles.taskTitle,
                  task.done && styles.taskDone
                ]}>
                  {task.title}
                </ThemedText>
                <TouchableOpacity>
                  <MaterialIcons 
                    name={task.done ? "check-circle" : "radio-button-unchecked"}
                    size={24}
                    color={task.done ? "#52C41A" : (isDark ? "#666" : "#999")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.taskFooter}>
                <View style={styles.timeContainer}>
                  <MaterialIcons name="access-time" size={16} color={isDark ? "#666" : "#999"} />
                  <ThemedText style={styles.timeText}>{task.time}</ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Add Task */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={[dynamicStyles.modalHeader]}>
              <ThemedText type="title" style={styles.modalTitle}>Nova Tarefa</ThemedText>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalSection}>
              <ThemedText style={styles.modalLabel}>Título</ThemedText>
              <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
                <MaterialIcons name="assignment" size={20} color={isDark ? '#666' : '#999'} />
                <TextInput
                  style={[styles.textInput, isDark && styles.textInputDark]}
                  placeholder="Digite o título da tarefa"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  value={newTask.title}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText style={styles.modalLabel}>Horário</ThemedText>
              <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
                <MaterialIcons name="access-time" size={20} color={isDark ? '#666' : '#999'} />
                <TextInput
                  style={[styles.textInput, isDark && styles.textInputDark]}
                  placeholder="Ex: 14:30"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  value={newTask.time}
                  onChangeText={(text) => setNewTask(prev => ({ ...prev, time: text }))}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText style={styles.modalLabel}>Prioridade</ThemedText>
              <View style={styles.priorityButtonsContainer}>
                {[
                  { value: 'low', label: 'Baixa' },
                  { value: 'medium', label: 'Média' },
                  { value: 'high', label: 'Alta' }
                ].map((priority) => (
                  <TouchableOpacity
                    key={priority.value}
                    style={[
                      styles.priorityButton,
                      { backgroundColor: getPriorityColor(priority.value as Task['priority']) },
                      newTask.priority === priority.value && styles.priorityButtonSelected
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, priority: priority.value as Task['priority'] }))}
                  >
                    <MaterialIcons 
                      name={priority.value === 'high' ? 'priority-high' : 'fiber-manual-record'} 
                      size={16} 
                      color="#FFF" 
                    />
                    <ThemedText style={styles.priorityButtonText}>
                      {priority.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setIsModalVisible(false)}
              >
                <MaterialIcons name="close" size={20} color="#FFF" />
                <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleAddTask}
              >
                <MaterialIcons name="check" size={20} color="#FFF" />
                <ThemedText style={styles.modalButtonText}>Confirmar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addFloatingButton}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

// Estilos adicionais
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,    // Reduzido de 20 para 15
    paddingTop: 40,
    minHeight: 80,  // Altura mínima do header
  },
  greeting: {
    fontSize: 24,
    marginBottom: 4,
  },
  date: {
    opacity: 0.6,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarStrip: {
    paddingHorizontal: 20,
    marginBottom: 10, // Reduzido de 20 para 10
    maxHeight: 50,   // Limitando altura do calendário
  },
  dayButton: {
    width: 60,
    height: 36,
    backgroundColor: '#FFF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dayButtonDark: {
    backgroundColor: '#2C2C2C',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
  },
  selectedDayText: {
    color: '#FFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonDark: {
    backgroundColor: '#2C2C2C',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.02 }],
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  filterContent: {
    alignItems: 'center',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  filterIndicator: {
    width: 20,
    height: 3,
    backgroundColor: '#FFF',
    borderRadius: 2,
    marginTop: 4,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 80,
    height: '100%',  // Ocupar toda altura disponível
    minHeight: 400,  // Altura mínima garantida
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  taskCardDark: {
    backgroundColor: '#2C2C2C',
  },
  priorityIndicator: {
    width: 4,
    backgroundColor: '#FF4D4F',
  },
  taskContent: {
    flex: 1,
    padding: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  taskDone: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    opacity: 0.6,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalContentDark: {
    backgroundColor: '#2C2C2C',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputWrapperDark: {
    backgroundColor: '#1A1A1A',
    borderColor: '#333',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    height: '100%',
    padding: 0, // Remove padding interno do TextInput
  },
  textInputDark: {
    color: '#FFF',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  priorityButtonSelected: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  priorityButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4D4F',
  },
  confirmButton: {
    backgroundColor: '#52C41A',
  },
  addFloatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  modalInputWrapperDark: {
    backgroundColor: '#1A1A1A',
  },
  priorityButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  filtersRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filtersStrip: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipDark: {
    backgroundColor: '#2C2C2C',
  },
  filterChipText: {
    fontSize: 13,
    marginLeft: 6,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});
