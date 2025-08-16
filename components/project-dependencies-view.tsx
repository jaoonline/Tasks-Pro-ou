"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Plus, Trash2, GitBranch, Network, Grid3X3, ArrowRight, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Task {
  id: string
  name: string
  status: "not-started" | "in-progress" | "completed" | "blocked"
  assignee: string
  estimatedDays: number
}

interface Dependency {
  id: string
  fromTaskId: string
  toTaskId: string
  type: "finish-to-start" | "start-to-start" | "finish-to-finish" | "start-to-finish"
  lag: number // in days
}

const mockTasks: Task[] = [
  { id: "1", name: "Project Planning", status: "completed", assignee: "John Doe", estimatedDays: 5 },
  { id: "2", name: "UI/UX Design", status: "completed", assignee: "Sarah Johnson", estimatedDays: 10 },
  { id: "3", name: "Frontend Development", status: "in-progress", assignee: "Mike Wilson", estimatedDays: 20 },
  { id: "4", name: "Backend Development", status: "in-progress", assignee: "Emily Davis", estimatedDays: 25 },
  { id: "5", name: "Database Setup", status: "completed", assignee: "Alex Brown", estimatedDays: 3 },
  { id: "6", name: "API Integration", status: "not-started", assignee: "John Doe", estimatedDays: 8 },
  { id: "7", name: "Testing & QA", status: "not-started", assignee: "Sarah Johnson", estimatedDays: 12 },
  { id: "8", name: "Deployment", status: "not-started", assignee: "Mike Wilson", estimatedDays: 2 },
]

const mockDependencies: Dependency[] = [
  { id: "1", fromTaskId: "1", toTaskId: "2", type: "finish-to-start", lag: 0 },
  { id: "2", fromTaskId: "2", toTaskId: "3", type: "finish-to-start", lag: 1 },
  { id: "3", fromTaskId: "1", toTaskId: "4", type: "finish-to-start", lag: 0 },
  { id: "4", fromTaskId: "5", toTaskId: "4", type: "finish-to-start", lag: 0 },
  { id: "5", fromTaskId: "3", toTaskId: "6", type: "finish-to-start", lag: 0 },
  { id: "6", fromTaskId: "4", toTaskId: "6", type: "finish-to-start", lag: 0 },
  { id: "7", fromTaskId: "6", toTaskId: "7", type: "finish-to-start", lag: 2 },
  { id: "8", fromTaskId: "7", toTaskId: "8", type: "finish-to-start", lag: 0 },
]

export function ProjectDependenciesView() {
  const [tasks] = useState<Task[]>(mockTasks)
  const [dependencies, setDependencies] = useState<Dependency[]>(mockDependencies)
  const [selectedView, setSelectedView] = useState<"list" | "network" | "matrix">("list")
  const [isAddingDependency, setIsAddingDependency] = useState(false)
  const [newDependency, setNewDependency] = useState<Partial<Dependency>>({
    type: "finish-to-start",
    lag: 0,
  })

  const getTaskById = (id: string) => tasks.find((task) => task.id === id)

  const getDependencyTypeLabel = (type: Dependency["type"]) => {
    switch (type) {
      case "finish-to-start":
        return "Finish to Start (FS)"
      case "start-to-start":
        return "Start to Start (SS)"
      case "finish-to-finish":
        return "Finish to Finish (FF)"
      case "start-to-finish":
        return "Start to Finish (SF)"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const detectCircularDependencies = () => {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    const cycles: string[][] = []

    const dfs = (taskId: string, path: string[]): boolean => {
      if (recursionStack.has(taskId)) {
        const cycleStart = path.indexOf(taskId)
        cycles.push(path.slice(cycleStart))
        return true
      }

      if (visited.has(taskId)) return false

      visited.add(taskId)
      recursionStack.add(taskId)

      const dependentTasks = dependencies.filter((dep) => dep.fromTaskId === taskId).map((dep) => dep.toTaskId)

      for (const dependentTask of dependentTasks) {
        if (dfs(dependentTask, [...path, dependentTask])) {
          return true
        }
      }

      recursionStack.delete(taskId)
      return false
    }

    for (const task of tasks) {
      if (!visited.has(task.id)) {
        dfs(task.id, [task.id])
      }
    }

    return cycles
  }

  const addDependency = () => {
    if (!newDependency.fromTaskId || !newDependency.toTaskId) return

    // Check for circular dependency
    const tempDependencies = [...dependencies, newDependency as Dependency]
    const originalDependencies = dependencies
    setDependencies(tempDependencies)

    const cycles = detectCircularDependencies()
    if (cycles.length > 0) {
      setDependencies(originalDependencies)
      alert("This dependency would create a circular dependency!")
      return
    }

    const dependency: Dependency = {
      id: Date.now().toString(),
      fromTaskId: newDependency.fromTaskId!,
      toTaskId: newDependency.toTaskId!,
      type: newDependency.type || "finish-to-start",
      lag: newDependency.lag || 0,
    }

    setDependencies((prev) => [...prev, dependency])
    setNewDependency({ type: "finish-to-start", lag: 0 })
    setIsAddingDependency(false)
  }

  const removeDependency = (id: string) => {
    setDependencies((prev) => prev.filter((dep) => dep.id !== id))
  }

  const circularDependencies = detectCircularDependencies()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Project Dependencies
          </CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={isAddingDependency} onOpenChange={setIsAddingDependency}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependency
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Dependency</DialogTitle>
                  <DialogDescription>Create a dependency relationship between two tasks.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="from-task" className="text-right">
                      From Task
                    </Label>
                    <Select
                      value={newDependency.fromTaskId}
                      onValueChange={(value) => setNewDependency((prev) => ({ ...prev, fromTaskId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select predecessor task" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="to-task" className="text-right">
                      To Task
                    </Label>
                    <Select
                      value={newDependency.toTaskId}
                      onValueChange={(value) => setNewDependency((prev) => ({ ...prev, toTaskId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select successor task" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks
                          .filter((task) => task.id !== newDependency.fromTaskId)
                          .map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dependency-type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newDependency.type}
                      onValueChange={(value: Dependency["type"]) =>
                        setNewDependency((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finish-to-start">Finish to Start (FS)</SelectItem>
                        <SelectItem value="start-to-start">Start to Start (SS)</SelectItem>
                        <SelectItem value="finish-to-finish">Finish to Finish (FF)</SelectItem>
                        <SelectItem value="start-to-finish">Start to Finish (SF)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lag" className="text-right">
                      Lag (days)
                    </Label>
                    <Input
                      id="lag"
                      type="number"
                      value={newDependency.lag || 0}
                      onChange={(e) =>
                        setNewDependency((prev) => ({ ...prev, lag: Number.parseInt(e.target.value) || 0 }))
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingDependency(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addDependency}>Add Dependency</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {circularDependencies.length > 0 && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Circular Dependencies Detected:</strong> The following task chains create circular dependencies
              that need to be resolved:
              {circularDependencies.map((cycle, index) => (
                <div key={index} className="mt-1">
                  {cycle.map((taskId) => getTaskById(taskId)?.name).join(" → ")}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network View
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Matrix View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {dependencies.map((dependency) => {
                  const fromTask = getTaskById(dependency.fromTaskId)
                  const toTask = getTaskById(dependency.toTaskId)

                  if (!fromTask || !toTask) return null

                  return (
                    <Card key={dependency.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(fromTask.status)}>
                              {fromTask.status}
                            </Badge>
                            <span className="font-medium">{fromTask.name}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(toTask.status)}>
                              {toTask.status}
                            </Badge>
                            <span className="font-medium">{toTask.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{getDependencyTypeLabel(dependency.type)}</Badge>
                          {dependency.lag > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {dependency.lag}d lag
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => removeDependency(dependency.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span>{fromTask.assignee}</span> → <span>{toTask.assignee}</span>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="h-96 border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
              <div className="text-center">
                <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Network Diagram</h3>
                <p className="text-muted-foreground">
                  Interactive network visualization of task dependencies would be rendered here. This would show tasks
                  as nodes and dependencies as connecting lines.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-4">
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    {tasks.map((task) => (
                      <TableHead key={task.id} className="text-center min-w-[100px]">
                        <div className="truncate" title={task.name}>
                          {task.name.substring(0, 10)}...
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((fromTask) => (
                    <TableRow key={fromTask.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(fromTask.status)}>
                            {fromTask.status}
                          </Badge>
                          {fromTask.name}
                        </div>
                      </TableCell>
                      {tasks.map((toTask) => {
                        const dependency = dependencies.find(
                          (dep) => dep.fromTaskId === fromTask.id && dep.toTaskId === toTask.id,
                        )
                        return (
                          <TableCell key={toTask.id} className="text-center">
                            {dependency ? (
                              <div className="flex flex-col items-center gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {dependency.type
                                    .split("-")
                                    .map((word) => word[0].toUpperCase())
                                    .join("")}
                                </Badge>
                                {dependency.lag > 0 && (
                                  <span className="text-xs text-muted-foreground">+{dependency.lag}d</span>
                                )}
                              </div>
                            ) : fromTask.id === toTask.id ? (
                              <div className="w-2 h-2 bg-muted rounded-full mx-auto" />
                            ) : (
                              <div className="w-2 h-2 mx-auto" />
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
