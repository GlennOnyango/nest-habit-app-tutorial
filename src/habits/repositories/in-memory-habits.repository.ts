import { Injectable } from '@nestjs/common';
import { InMemoryDbService } from 'src/in-memory-db/in-memory-db.service';
import { HabitDTO } from '../dto/habit.dto';
import { HabitEntity } from './entities/habit.entity';

@Injectable()
export class InMemoryHabitsRepository {
  constructor(private readonly db: InMemoryDbService) {}

  findAllHabits(query: { limit?: number; sortBy?: string }): HabitDTO[] {
    const habitsEntities = this.db.findAll<HabitEntity>('habits', query);

    return habitsEntities.map((habitEntity) => ({
      id: +habitEntity.habitid,
      name: habitEntity.name,
      description: habitEntity.description,
    }));
  }

  findHabitsById(id: number): HabitDTO | undefined {
    const habit = this.db.findOneBy<HabitEntity>('habits', { habitid: id });

    if (!habit) {
      return;
    }

    return {
      id: +habit.habitid,
      name: habit.name,
      description: habit.description,
    };
  }

  createHabit(newHabit: HabitEntity): HabitDTO {
    const habit = this.db.create<HabitEntity>('habits', newHabit);

    return {
      id: habit.habitid,
      name: habit.name,
      description: habit.description,
    };
  }

  updateHabit(
    id: number,
    updatedHabitMeta: Partial<HabitEntity>,
  ): HabitDTO | undefined {
    const habit = this.db.findOneBy<HabitEntity>('habits', { habitid: id });

    if (!habit) {
      return;
    }

    const now = new Date();
    const updatedHabit = this.db.update<HabitEntity>('habits', habit.id, {
      ...habit,
      ...updatedHabitMeta,
      updatedAt: now,
    });

    if (!updatedHabit) {
      return;
    }

    return {
      id: +updatedHabit.habitid,
      name: updatedHabit.name,
      description: updatedHabit.description,
    };
  }

  deleteHabit(id: number): HabitDTO | undefined {
    const habit = this.db.findOneBy<HabitEntity>('habits', { habitid: id });

    if (!habit) {
      return;
    }

    const deletedHabit = this.db.delete<HabitEntity>('habits', habit.id);

    if (!deletedHabit) {
      return;
    }

    return {
      id: +deletedHabit.habitid,
      name: deletedHabit.name,
      description: deletedHabit.description,
    };
  }
}
