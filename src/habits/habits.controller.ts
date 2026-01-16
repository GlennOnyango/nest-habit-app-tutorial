import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitDTO } from './dto/habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  findAll(
    @Query('limit') limit: string,
    @Query('sortBy') sortBy: string,
  ): HabitDTO[] | Promise<HabitDTO[]> {
    return this.habitsService.findAll({ limit: +limit, sortBy });
  }

  @Get(':id')
  findOne(@Param('id') id: string): HabitDTO | Promise<HabitDTO> {
    const habit = this.habitsService.findOne(+id);

    if (!habit) {
      throw new NotFoundException(`Habit with id ${id} not found`);
    }
    return habit;
  }

  @Post()
  createHabit(
    @Body() newHabit: { habitid: number; name: string },
  ): HabitDTO | Promise<HabitDTO> {
    return this.habitsService.crearteHabit(newHabit);
  }

  @Put(':id')
  updateHabit(
    @Body() updatedHabit: { name: string; description: string },
    @Param('id') id: string,
  ) {
    const updateResponse = this.habitsService.updateHabit(+id, updatedHabit);

    if (!updateResponse) {
      throw new NotFoundException(`Entity with ID not found ${id}`);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteHabit(@Param('id') id: string): void {
    this.habitsService.deleteHabit(+id);
  }
}
