import { plannerAgent } from "./planner-agent";
import { riskAgent } from "./risk-agent";
import { motivationAgent, dailyMotivation } from "./motivation-agent";
import { reportAgent } from "./report-agent";

export const functions = [
  plannerAgent,
  riskAgent,
  motivationAgent,
  dailyMotivation,
  reportAgent
];