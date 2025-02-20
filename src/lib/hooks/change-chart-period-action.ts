import { createActionClient } from '@/lib/tools';
import { changeChartPeriodSchema, type ChartPeriod } from "./schema";

const authActionClient = createActionClient();

interface ActionContext {
  user: {
    team_id: string;
  };
}

export const changeChartPeriodAction = authActionClient
  .schema(changeChartPeriodSchema)
  .metadata()
  .action(async ({ parsedInput: value, ctx }: { parsedInput: ChartPeriod; ctx: ActionContext }) => {
    // Trigger any necessary revalidation or state updates
    window.dispatchEvent(new CustomEvent(`chart_${ctx.user.team_id}_update`));
    
    return {
      data: value,
      metadata: {
        period: {
          from: new Date().toISOString(), // You might want to adjust these based on the selected period
          to: new Date().toISOString()
        }
      }
    };
  });
