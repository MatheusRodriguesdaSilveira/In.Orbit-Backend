import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import { sql } from 'drizzle-orm';

export async function deleteGoal(goalId: string) {
  try {
    // Verifica se a meta existe antes de tentar deletá-la
    const existingGoal = await db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(sql`${goals.id} = ${goalId}`);

    if (existingGoal.length === 0) {
      throw new Error('Goal not found');
    }

    // Deletar as referências na tabela goal_completions
    await db.delete(goalCompletions).where(sql`${goalCompletions.goalId} = ${goalId}`);

    // Agora deletar a meta
    const deleteResult = await db.delete(goals).where(sql`${goals.id} = ${goalId}`);

    // Log para depuração
    console.log('Delete result:', deleteResult);

    // Verifique se ainda existe algum registro com o goalId após a exclusão
    const checkGoalAfterDelete = await db
      .select()
      .from(goals)
      .where(sql`${goals.id} = ${goalId}`);

    if (checkGoalAfterDelete.length > 0) {
      throw new Error('Failed to delete goal');
    }

    return { message: 'Goal deleted successfully' };
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw new Error('Failed to delete goal');
  }
}
