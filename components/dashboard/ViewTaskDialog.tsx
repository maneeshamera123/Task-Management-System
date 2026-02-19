"use client"

import { useState } from "react"
import { Task } from "@/lib/utils/client-task";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getStatusIcon, getStatusColor, getPriorityColor } from "@/lib/utils/task-utils"
import { useTaskForm } from "@/lib/hooks/use-task-form"
import { useTaskOperations } from "@/lib/hooks/use-task-operations"

interface ViewTaskDialogProps {
  task: Task
  isEditable?: boolean
  children?: React.ReactNode
}

export function ViewTaskDialog({ task, isEditable = false, children }: ViewTaskDialogProps) {
  const [open, setOpen] = useState(false)
  
  const { formData, loading, isValid, setInitialData, handleInputChange, validateForm, getSubmitData } = useTaskForm({
    initialTask: task,
    onSuccess: () => {
      setOpen(false)
    }
  })
  
  const { updateTask } = useTaskOperations({
    refreshOnSuccess: true,
    onSuccess: () => {
      toast.success("Task Updated Successfully");
      setOpen(false);
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditable) return
    
    const validationError = validateForm()
    if (validationError) {
      return
    }

    try {
      await updateTask(task.id, getSubmitData())
    } catch (error) {
      // Error is handled by useTaskOperations hook
    }
  }

  const formatDateTime = (dateString: string | Date | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const validationError = validateForm()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStatusIcon(task.status)}
              {isEditable ? "Edit Task" : task.title}
            </DialogTitle>
            <DialogDescription>
              {isEditable ? "Update the task details below." : "Task details and information"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              {isEditable ? (
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.title}</p>
              )}
              {isEditable && validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              {isEditable ? (
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter task description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 min-h-[60px] whitespace-pre-wrap">
                  {task.description || "No description provided"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                {isEditable ? (
                  <Select
                    value={formData.status}
                    onValueChange={(value: "pending" | "in-progress" | "completed") => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(task.status)}`}>
                    {task.status.replace("-", " ")}
                  </span>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                {isEditable ? (
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high" | "urgent") => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date & Time</Label>
              {isEditable ? (
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDateTime(task.dueDate)}
                </p>
              )}
            </div>

            {!isEditable && (
              <>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created At
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDateTime(task.createdAt)}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Updated
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDateTime(task.updatedAt)}
                  </p>
                </div>
              </>
            )}
          </div>
          {isEditable && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !isValid}>
                {loading ? "Updating..." : "Update Task"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
