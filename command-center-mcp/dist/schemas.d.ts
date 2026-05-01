import { z } from 'zod';
export declare const CreateMilestoneSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    domain: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    phase: z.ZodOptional<z.ZodString>;
    planned_start: z.ZodOptional<z.ZodString>;
    planned_end: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    id: string;
    title: string;
    phase?: string | undefined;
    planned_start?: string | undefined;
    planned_end?: string | undefined;
}, {
    id: string;
    title: string;
    domain?: string | undefined;
    phase?: string | undefined;
    planned_start?: string | undefined;
    planned_end?: string | undefined;
}>;
export declare const AddMilestoneTaskSchema: z.ZodObject<{
    milestone_id: z.ZodString;
    label: z.ZodString;
    priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<["P1", "P2", "P3", "P4"]>>>;
    acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    depends_on: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    execution_mode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["human", "agent", "pair"]>>>;
}, "strip", z.ZodTypeAny, {
    milestone_id: string;
    label: string;
    priority: "P1" | "P2" | "P3" | "P4";
    execution_mode: "agent" | "human" | "pair";
    acceptance_criteria?: string[] | undefined;
    constraints?: string[] | undefined;
    depends_on?: string[] | undefined;
}, {
    milestone_id: string;
    label: string;
    priority?: "P1" | "P2" | "P3" | "P4" | undefined;
    acceptance_criteria?: string[] | undefined;
    constraints?: string[] | undefined;
    depends_on?: string[] | undefined;
    execution_mode?: "agent" | "human" | "pair" | undefined;
}>;
export declare const StartTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    agent_id: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    agent_id: string;
}, {
    task_id: string;
    agent_id?: string | undefined;
}>;
export declare const CompleteTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    summary: z.ZodString;
    agent_id: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    task_id: string;
    agent_id: string;
}, {
    summary: string;
    task_id: string;
    agent_id?: string | undefined;
}>;
export declare const ApproveTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    feedback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    feedback?: string | undefined;
}, {
    task_id: string;
    feedback?: string | undefined;
}>;
export declare const RejectTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    feedback: z.ZodString;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    feedback: string;
}, {
    task_id: string;
    feedback: string;
}>;
export declare const BlockTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    task_id: string;
}, {
    reason: string;
    task_id: string;
}>;
export declare const UnblockTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    resolution: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    resolution?: string | undefined;
}, {
    task_id: string;
    resolution?: string | undefined;
}>;
export declare const UpdateTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    priority: z.ZodOptional<z.ZodEnum<["P1", "P2", "P3", "P4"]>>;
    assignee: z.ZodOptional<z.ZodString>;
    execution_mode: z.ZodOptional<z.ZodEnum<["human", "agent", "pair"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    priority?: "P1" | "P2" | "P3" | "P4" | undefined;
    execution_mode?: "agent" | "human" | "pair" | undefined;
    assignee?: string | undefined;
    notes?: string | undefined;
}, {
    task_id: string;
    priority?: "P1" | "P2" | "P3" | "P4" | undefined;
    execution_mode?: "agent" | "human" | "pair" | undefined;
    assignee?: string | undefined;
    notes?: string | undefined;
}>;
export declare const EnrichTaskSchema: z.ZodObject<{
    task_id: z.ZodString;
    prompt: z.ZodOptional<z.ZodString>;
    builder_prompt: z.ZodOptional<z.ZodString>;
    acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    constraints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    context_files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    reference_docs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    prompt?: string | undefined;
    acceptance_criteria?: string[] | undefined;
    constraints?: string[] | undefined;
    builder_prompt?: string | undefined;
    context_files?: string[] | undefined;
    reference_docs?: string[] | undefined;
}, {
    task_id: string;
    prompt?: string | undefined;
    acceptance_criteria?: string[] | undefined;
    constraints?: string[] | undefined;
    builder_prompt?: string | undefined;
    context_files?: string[] | undefined;
    reference_docs?: string[] | undefined;
}>;
export declare const LogActionSchema: z.ZodObject<{
    task_id: z.ZodString;
    action: z.ZodString;
    description: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    agent_id: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    task_id: string;
    agent_id: string;
    action: string;
    tags?: string[] | undefined;
}, {
    description: string;
    task_id: string;
    action: string;
    agent_id?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const RegisterAgentSchema: z.ZodObject<{
    agent_id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["orchestrator", "sub-agent", "human", "external"]>;
    permissions: z.ZodArray<z.ZodEnum<["read", "write"]>, "many">;
    color: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    parent_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "human" | "orchestrator" | "sub-agent" | "external";
    agent_id: string;
    permissions: ("write" | "read")[];
    color: string;
    parent_id?: string | undefined;
}, {
    name: string;
    type: "human" | "orchestrator" | "sub-agent" | "external";
    agent_id: string;
    permissions: ("write" | "read")[];
    color?: string | undefined;
    parent_id?: string | undefined;
}>;
export declare const SetMilestoneDatesSchema: z.ZodObject<{
    milestone_id: z.ZodString;
    actual_start: z.ZodOptional<z.ZodString>;
    actual_end: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    milestone_id: string;
    actual_start?: string | undefined;
    actual_end?: string | undefined;
}, {
    milestone_id: string;
    actual_start?: string | undefined;
    actual_end?: string | undefined;
}>;
export declare const UpdateDriftSchema: z.ZodObject<{
    milestone_id: z.ZodString;
    drift_days: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    milestone_id: string;
    drift_days: number;
}, {
    milestone_id: string;
    drift_days: number;
}>;
export declare const AddMilestoneNoteSchema: z.ZodObject<{
    milestone_id: z.ZodString;
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    milestone_id: string;
    note: string;
}, {
    milestone_id: string;
    note: string;
}>;
export declare const ListTasksSchema: z.ZodObject<{
    milestone_id: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["todo", "in_progress", "review", "done", "blocked"]>>;
    domain: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    domain?: string | undefined;
    status?: "todo" | "in_progress" | "review" | "done" | "blocked" | undefined;
    milestone_id?: string | undefined;
}, {
    domain?: string | undefined;
    status?: "todo" | "in_progress" | "review" | "done" | "blocked" | undefined;
    milestone_id?: string | undefined;
}>;
export declare const GetActivityFeedSchema: z.ZodObject<{
    agent_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    agent_id?: string | undefined;
}, {
    agent_id?: string | undefined;
    limit?: number | undefined;
}>;
export declare const GetTaskContextSchema: z.ZodObject<{
    task_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    task_id: string;
}, {
    task_id: string;
}>;
export declare const GetMilestoneOverviewSchema: z.ZodObject<{
    milestone_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    milestone_id: string;
}, {
    milestone_id: string;
}>;
export declare const GetTaskHistorySchema: z.ZodObject<{
    task_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    task_id: string;
}, {
    task_id: string;
}>;
