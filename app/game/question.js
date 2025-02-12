import { useLocalSearchParams } from 'expo-router';
import QuestionScreen from '../../screens/QuestionScreen';
import { Stack } from 'expo-router';

export default function QuestionRoute() {
  const params = useLocalSearchParams();
  let questionData;
  
  try {
    questionData = JSON.parse(params.questionData);
    console.log('Parsed question data:', questionData);
  } catch (error) {
    console.error('Error parsing question data:', error);
    return null;
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'السؤال',
          headerShown: true
        }}
      />
      <QuestionScreen questionData={questionData} />
    </>
  );
} 