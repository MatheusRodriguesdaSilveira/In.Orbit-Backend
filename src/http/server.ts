import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { createGoalRoute } from './routes/create-goal';
import { createGoalCompletionRoute } from './routes/create-goal-completion';
import { getWeekSummaryRoute } from './routes/get-week-summary';
import { getWeekPendingGoalsRoute } from './routes/get-week-pending-goals';
import { deleteGoalRoute } from './routes/delete-goal'; // Importe a rota de deleção

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, { origin: '*' });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registre as rotas
app.register(createGoalRoute);
app.register(createGoalCompletionRoute);
app.register(getWeekSummaryRoute);
app.register(getWeekPendingGoalsRoute);
app.register(deleteGoalRoute); 

// Função async para inicializar o servidor
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`HTTP server running on port ${port}!`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
