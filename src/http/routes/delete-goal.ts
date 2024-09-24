import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { deleteGoal } from '../../functions/delete-goal';

export const deleteGoalRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/goals/:goalId',
    {
      schema: {
        params: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.params;

      try {
        await deleteGoal(goalId);
        return { message: 'Goal deleted successfully', goalId };
      } catch (error) {
        console.error('Deletion error:', error);

        // Verificando se o erro é uma instância de Error
        if (error instanceof Error) {
          return { error: error.message }; // Retorna a mensagem de erro
        }

        // Se o erro não for do tipo Error, retorna uma mensagem genérica
        return { error: 'Failed to delete goal' };
      }
    }
  );
};
