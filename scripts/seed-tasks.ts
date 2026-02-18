import "dotenv/config";

import { db } from '../lib/db';
import { tasks, users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

// Sample task data for seeding
const sampleTasks = [
  {
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new API endpoints including request/response formats and authentication requirements",
    priority: "high" as const,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: "Fix authentication bug",
    description: "Resolve the login issue reported by multiple users where they get 'Invalid credentials' error with correct password",
    priority: "urgent" as const,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    title: "Design new dashboard",
    description: "Create mockups and wireframes for the analytics dashboard with charts and KPI displays",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    title: "Optimize database queries",
    description: "Improve performance of slow-running queries, particularly the user report generation query",
    priority: "high" as const,
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
  },
  {
    title: "Update dependencies",
    description: "Update all npm packages to latest stable versions and test for compatibility",
    priority: "low" as const,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    title: "Implement search functionality",
    description: "Add advanced search with filters to the task list for better user experience",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
  },
  {
    title: "Add unit tests",
    description: "Write comprehensive unit tests for the authentication module and task management features",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
  },
  {
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    priority: "high" as const,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    title: "Code review for PR #234",
    description: "Review and provide feedback on the payment integration pull request",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    title: "Update user guide",
    description: "Update the user documentation with new features and screenshots",
    priority: "low" as const,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
  {
    title: "Fix responsive design issues",
    description: "Resolve mobile layout problems on the dashboard and settings pages",
    priority: "high" as const,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    title: "Implement dark mode",
    description: "Add dark mode toggle and ensure all components support dark theme",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
  },
  {
    title: "Database backup strategy",
    description: "Implement automated daily backups with proper retention policies",
    priority: "urgent" as const,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    title: "Performance monitoring",
    description: "Setup application performance monitoring and alerting system",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
  {
    title: "Security audit",
    description: "Conduct comprehensive security audit and fix any vulnerabilities found",
    priority: "high" as const,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  }
];

async function seedTasks() {
  try {
    console.log('Starting task seeding...');
    
    // Get the first user from the database (you should have at least one user)
    const userRows = await db.select().from(users).limit(1);
    
    if (userRows.length === 0) {
      console.error('No users found in database. Please create a user first.');
      process.exit(1);
    }
    
    const userId = userRows[0].id;
    console.log(`Using user ID: ${userId}`);
    
    console.log('Inserting new tasks...');
    const tasksToInsert = sampleTasks.map((task, index) => {
      let status: 'pending' | 'in-progress' | 'completed';
      if (index < 5) {
        status = 'pending';
      } else if (index < 10) {
        status = 'in-progress';
      } else {
        status = 'completed';
      }
      
      return {
        ...task,
        userId,
        status,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        updatedAt: new Date(),
      };
    });
    
    const insertedTasks = await db.insert(tasks).values(tasksToInsert).returning();
    
    console.log(`Successfully seeded ${insertedTasks.length} tasks!`);
    console.log('\nTask summary:');
    console.log(`- Pending: ${insertedTasks.filter(t => t.status === 'pending').length}`);
    console.log(`- In Progress: ${insertedTasks.filter(t => t.status === 'in-progress').length}`);
    console.log(`- Completed: ${insertedTasks.filter(t => t.status === 'completed').length}`);
    console.log(`- Urgent: ${insertedTasks.filter(t => t.priority === 'urgent').length}`);
    console.log(`- High: ${insertedTasks.filter(t => t.priority === 'high').length}`);
    console.log(`- Medium: ${insertedTasks.filter(t => t.priority === 'medium').length}`);
    console.log(`- Low: ${insertedTasks.filter(t => t.priority === 'low').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
}

seedTasks();
