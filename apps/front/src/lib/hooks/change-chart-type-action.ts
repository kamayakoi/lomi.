import Cookies from 'js-cookie';
import { createActionClient } from '@/lib/tools';
import { changeChartTypeSchema, type ChartType } from "./schema";

const authActionClient = createActionClient();

export const CHART_TYPE_COOKIE = 'chart-type';

interface ActionContext {
  user: {
    team_id: string;
  };
}

export const changeChartTypeAction = authActionClient
  .schema(changeChartTypeSchema)
  .metadata()
  .action(async ({ parsedInput: value, ctx }: { parsedInput: ChartType; ctx: ActionContext }) => {
    // Store the chart type preference in a cookie
    Cookies.set(`chart_type_${ctx.user.team_id}`, value, { expires: 365 });
    
    // Trigger any necessary revalidation or state updates
    window.dispatchEvent(new CustomEvent(`chart_${ctx.user.team_id}_update`));
    
    return {
      data: value,
      metadata: {
        period: {
          from: new Date().toISOString(),
          to: new Date().toISOString()
        }
      }
    };
  });
