import {User} from './User';

export interface FitnessGroup {
  _id: string;
  name: string;
  trainer: string;
  startTime: string;
  endTime: string;
  description: string;
  users: User[];
}
