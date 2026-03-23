"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserDetailContext } from "@/context/UserDetailContext"
import { UserButton } from "@clerk/nextjs"
import {
  MoreHorizontal,
  Trash2,
  Edit2,
  FileText,
  Plus,
  FolderPlus,
  Loader2,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

// Helper
const generateRandomFrameNumber = () =>
  Math.floor(Math.random() * 10000).toString()

export function AppSidebar() {
  const [projectList, setProjectList] = useState<any[]>([])
  const { UserDetail, refetchCredits, isLoading: isUserLoading } = useContext(UserDetailContext)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // --- Create Project Modal ---
  const [createOpen, setCreateOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // --- Rename Modal ---
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<{
    projectId: string
    name: string
  } | null>(null)
  const [renameName, setRenameName] = useState("")

  // --- Delete Confirm ---
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    if (UserDetail) {
      fetchProjects()
    }
  }, [UserDetail])

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects")
      setProjectList(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  // ─── Create Project ───
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    setIsCreating(true)

    const projectId = uuidv4()
    const frameId = generateRandomFrameNumber()

    try {
      await axios.post("/api/projects", {
        projectId,
        frameId,
        messages: [],
        name: newProjectName.trim(),
      })
      toast.success("Project created!")
      setCreateOpen(false)
      setNewProjectName("")
      fetchProjects()
      router.push(`/playground/${projectId}?frameId=${frameId}`)
    } catch (e) {
      console.error(e)
      toast.error("Failed to create project")
    } finally {
      setIsCreating(false)
    }
  }

  // ─── Delete Project ───
  const handleDelete = async () => {
    if (!deleteTarget) return

    // Optimistic UI
    setProjectList((prev) => prev.filter((p) => p.projectId !== deleteTarget))
    setDeleteOpen(false)

    try {
      await axios.delete("/api/projects", { data: { projectId: deleteTarget } })
      toast.success("Project deleted")
    } catch (err) {
      toast.error("Failed to delete project")
      fetchProjects()
    } finally {
      setDeleteTarget(null)
    }
  }

  // ─── Rename Project ───
  const handleRename = async () => {
    if (!renameTarget || !renameName.trim() || renameName === renameTarget.name)
      return

    // Optimistic
    setProjectList((prev) =>
      prev.map((p) =>
        p.projectId === renameTarget.projectId
          ? { ...p, name: renameName.trim() }
          : p
      )
    )
    setRenameOpen(false)

    try {
      await axios.put("/api/projects", {
        projectId: renameTarget.projectId,
        name: renameName.trim(),
      })
      toast.success("Project renamed")
    } catch (err) {
      toast.error("Failed to rename")
      fetchProjects()
    } finally {
      setRenameTarget(null)
    }
  }

  // ─── Purchase Credits via Stripe ───
  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const res = await axios.post("/api/create-checkout-session")
      const { url } = res.data
      if (url) {
        window.location.href = url
      } else {
        toast.error("Failed to create payment session.")
        setIsUpgrading(false)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to start payment. Please try again.")
      setIsUpgrading(false)
    }
  }

  // Check if a project is currently active
  const isActive = (projectId: string) =>
    pathname?.includes(`/playground/${projectId}`)

  const credits = UserDetail?.credits ?? 0
  const maxCredits = 12

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-5">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={35} height={35} />
            <h2 className="font-bold text-xl">AI Website Builder</h2>
          </div>
          <Button
            className="w-full mt-5 gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {projectList.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FolderPlus className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No projects yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click &quot;New Project&quot; to get started
                  </p>
                </div>
              ) : (
                projectList.map((project, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive(project.projectId)
                          ? "bg-blue-50 border-l-2 border-blue-500"
                          : ""
                      }
                    >
                      <Link
                        href={`/playground/${project.projectId}?frameId=${project.frameId}`}
                      >
                        <FileText className="h-4 w-4 mr-2 shrink-0" />
                        <div className="flex flex-col items-start gap-0.5 w-full overflow-hidden">
                          <span
                            className={`truncate w-full text-sm ${
                              isActive(project.projectId)
                                ? "font-semibold text-blue-700"
                                : "font-medium"
                            }`}
                          >
                            {project.name || "Untitled Project"}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(project.createdOn).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal className="h-4 w-4" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onClick={() => {
                            setRenameTarget({
                              projectId: project.projectId,
                              name: project.name || "",
                            })
                            setRenameName(project.name || "")
                            setRenameOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteTarget(project.projectId)
                            setDeleteOpen(true)
                          }}
                          className="text-red-500 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <div className="p-3 border rounded-xl space-y-3 bg-secondary">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Credits</span>
              <span className="font-bold text-gray-900 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                {isUserLoading ? "..." : credits}
              </span>
            </div>
            <Progress
              value={Math.min((credits / maxCredits) * 100, 100)}
            />
            <Button
              className="w-full"
              onClick={handleUpgrade}
              disabled={isUpgrading}
            >
              {isUpgrading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isUpgrading ? "Redirecting to payment..." : "Buy 10 Credits — ₹99"}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <UserButton />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* ────── Create Project Dialog ────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Give your project a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="e.g. My Portfolio Site"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newProjectName.trim()) {
                    handleCreateProject()
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false)
                setNewProjectName("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || isCreating}
              className="gap-2"
            >
              {isCreating && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ────── Rename Dialog ────── */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rename-input">Project Name</Label>
              <Input
                id="rename-input"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && renameName.trim()) {
                    handleRename()
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!renameName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ────── Delete Confirmation ────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project, all its pages, and chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}