type ToolResult = {
    content: {
        type: string;
        text: string;
    }[];
    isError?: boolean;
};
export declare const toolDefinitions: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id?: undefined;
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            milestone_id: {
                type: string;
            };
            task_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            milestone_id: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            domain: {
                type: string;
            };
            task_id?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            agent_id: {
                type: string;
            };
            limit: {
                type: string;
            };
            task_id?: undefined;
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            agent_id: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            summary: {
                type: string;
            };
            agent_id: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            limit?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            feedback: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            reason: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            resolution: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            priority: {
                type: string;
                enum: string[];
            };
            assignee: {
                type: string;
            };
            execution_mode: {
                type: string;
                enum: string[];
            };
            notes: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            action: {
                type: string;
            };
            description: {
                type: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
            };
            agent_id: {
                type: string;
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            task_id: {
                type: string;
            };
            prompt: {
                type: string;
            };
            builder_prompt: {
                type: string;
            };
            acceptance_criteria: {
                type: string;
                items: {
                    type: string;
                };
            };
            constraints: {
                type: string;
                items: {
                    type: string;
                };
            };
            context_files: {
                type: string;
                items: {
                    type: string;
                };
            };
            reference_docs: {
                type: string;
                items: {
                    type: string;
                };
            };
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            milestone_id: {
                type: string;
            };
            note: {
                type: string;
            };
            task_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            milestone_id: {
                type: string;
            };
            actual_start: {
                type: string;
            };
            actual_end: {
                type: string;
            };
            task_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            milestone_id: {
                type: string;
            };
            drift_days: {
                type: string;
            };
            task_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
            };
            title: {
                type: string;
            };
            domain: {
                type: string;
            };
            phase: {
                type: string;
            };
            planned_start: {
                type: string;
            };
            planned_end: {
                type: string;
            };
            task_id?: undefined;
            milestone_id?: undefined;
            status?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            label?: undefined;
            depends_on?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            milestone_id: {
                type: string;
            };
            label: {
                type: string;
            };
            priority: {
                type: string;
                enum: string[];
            };
            acceptance_criteria: {
                type: string;
                items: {
                    type: string;
                };
            };
            constraints: {
                type: string;
                items: {
                    type: string;
                };
            };
            depends_on: {
                type: string;
                items: {
                    type: string;
                };
            };
            execution_mode: {
                type: string;
                enum: string[];
            };
            task_id?: undefined;
            status?: undefined;
            domain?: undefined;
            agent_id?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            assignee?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            name?: undefined;
            type?: undefined;
            permissions?: undefined;
            color?: undefined;
            parent_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            agent_id: {
                type: string;
            };
            name: {
                type: string;
            };
            type: {
                type: string;
                enum: string[];
            };
            permissions: {
                type: string;
                items: {
                    type: string;
                    enum: string[];
                };
            };
            color: {
                type: string;
            };
            parent_id: {
                type: string;
            };
            task_id?: undefined;
            milestone_id?: undefined;
            status?: undefined;
            domain?: undefined;
            limit?: undefined;
            summary?: undefined;
            feedback?: undefined;
            reason?: undefined;
            resolution?: undefined;
            priority?: undefined;
            assignee?: undefined;
            execution_mode?: undefined;
            notes?: undefined;
            action?: undefined;
            description?: undefined;
            tags?: undefined;
            prompt?: undefined;
            builder_prompt?: undefined;
            acceptance_criteria?: undefined;
            constraints?: undefined;
            context_files?: undefined;
            reference_docs?: undefined;
            note?: undefined;
            actual_start?: undefined;
            actual_end?: undefined;
            drift_days?: undefined;
            id?: undefined;
            title?: undefined;
            phase?: undefined;
            planned_start?: undefined;
            planned_end?: undefined;
            label?: undefined;
            depends_on?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleTool(name: string, args: any): Promise<ToolResult>;
export {};
