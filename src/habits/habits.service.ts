import { HabitDTO } from './dto/habit.dto';
import { HabitEntity } from './repositories/entities/habit.entity';
import { InMemoryHabitsRepository } from './repositories/in-memory-habits.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HabitsService {
  constructor(private readonly inMemoryHabit: InMemoryHabitsRepository) {}
  findAll(query: {
    limit?: number;
    sortBy?: string;
  }): HabitDTO[] | Promise<HabitDTO[]> {
    const limit = query.limit ?? 1;
    const sortBy = query.sortBy ?? 'name';
    return this.inMemoryHabit.findAllHabits({ limit, sortBy });
  }

  findOne(id: number): HabitDTO | undefined | Promise<HabitDTO> {
    return this.inMemoryHabit.findHabitsById(id);
  }

  crearteHabit(newHabit: {
    habitid: number;
    name: string;
  }): HabitDTO | Promise<HabitDTO> {
    const now = new Date();
    return this.inMemoryHabit.createHabit({
      ...newHabit,
      id: now.getTime().toString(),
      createdAt: now,
      updatedAt: now,
    });
  }

  updateHabit(
    id: number,
    updatedHabit: Partial<HabitEntity>,
  ): HabitDTO | undefined {
    return this.inMemoryHabit.updateHabit(id, updatedHabit);
  }

  deleteHabit(id: number): HabitDTO | undefined {
    return this.inMemoryHabit.deleteHabit(id);
  }
}
