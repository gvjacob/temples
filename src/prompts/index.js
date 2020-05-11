import { Select } from 'enquirer';

export const promptCommand = async (commands) => {
  const prompt = new Select({
    name: 'command',
    message: 'Select command to run',
    choices: commands,
  });

  const answer = await prompt.run();
  return answer;
};
