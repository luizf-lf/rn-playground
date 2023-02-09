import {
  ActivityIndicator,
  Text,
  TextInput,
} from '@react-native-material/core';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { textColor } from '../constants/colors';
import { globalStyles } from '../constants/globalStyles';
import firestore from '@react-native-firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import TaskInterface from '../interfaces/TaskInterface';
import TaskItem from '../components/TaskItem';
import Icon from 'react-native-vector-icons/MaterialIcons';

function FireListScreen() {
  const [taskInput, setTaskInput] = useState('');
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [fireData, setFireData] = useState([] as TaskInterface[]);
  const tasksCollectionRef = firestore().collection('Tasks');

  useEffect(() => {
    tasksCollectionRef.orderBy('date', 'desc').onSnapshot(
      dataSnapshot => {
        console.log('Firebase Tasks snapshot updated at ' + new Date());
        const items = [] as TaskInterface[];
        dataSnapshot.forEach(fireItem => {
          const { date, description, done, title } = fireItem.data();
          items.push({ id: fireItem.id, date, description, done, title });
        });
        setFireData(items);
      },
      error => {
        Alert.alert('There was an error recovering the Tasks data.');
        console.error('Error recovering Tasks: ' + error);
      },
    );
  }, []);

  const handleTaskSubmit = () => {
    if (taskInput.length > 0) {
      setIsSavingTask(true);
      tasksCollectionRef
        .add({
          date: Date.now(),
          title: taskInput,
          description: null,
          done: false,
        })
        .then(() => {
          setTaskInput('');
        })
        .catch(e => {
          Alert.alert('There was an error saving a new task. Try again later.');
          console.error('Error on adding a new task: ' + e);
        })
        .finally(() => setIsSavingTask(false));
    }
  };

  return (
    <View
      style={{
        ...globalStyles.viewContainer,
        justifyContent: 'space-between',
        flexGrow: 1,
      }}>
      <Text color={textColor} variant="h5" style={{ marginBottom: 16 }}>
        Tasks
      </Text>
      <FlatList
        data={fireData}
        keyExtractor={data => data.id}
        renderItem={TaskItem}
        ListEmptyComponent={() => (
          <View style={{ flexGrow: 1 }}>
            <Text color={textColor} variant="caption">
              No Items
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
      />
      <TextInput
        placeholder="Write your task here. Press enter to save."
        value={taskInput}
        onChangeText={input => setTaskInput(input)}
        onEndEditing={handleTaskSubmit}
        trailing={
          isSavingTask ? (
            <ActivityIndicator size="large" />
          ) : (
            <Icon name="send" size={24} />
          )
        }
      />
    </View>
  );
}

export default FireListScreen;
