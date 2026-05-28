'use client'

import React from 'react'

import { permissionColumns } from '@/app/(dashboard)/dashboard/permissions/columns'
import CreatePermissionForm from '@/app/(dashboard)/dashboard/permissions/create-permission-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DataTable from '@/components/ui/data-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useAllPermissions from '@/hooks/use-all-permissions'
import { PermissionType } from '@/schemas/permission.schema'

type PermissionsTableContext = {
  currentPermission: PermissionType | null
  setCurrentPermission: React.Dispatch<React.SetStateAction<PermissionType | null>>
}

const PermissionsTableContext = React.createContext<PermissionsTableContext>({
  currentPermission: null,
  setCurrentPermission: () => {},
})

export const usePermissionsTableContext = () => React.useContext(PermissionsTableContext)

export default function PermissionsTable() {
  const { permissions, totalPermissions, getAllPermissionsQuery } = useAllPermissions()
  const [currentPermission, setCurrentPermission] = React.useState<PermissionType | null>(null)

  return (
    <PermissionsTableContext.Provider value={{ currentPermission, setCurrentPermission }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Permissions ({totalPermissions})</CardTitle>
          <CardDescription>
            Permission được tạo tự động nên không thể thêm ở đây. Chỉ được cập nhật mô tả của các permission hiện có.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={permissionColumns} data={permissions} />
        </CardContent>
      </Card>

      {/* Cập nhật permission */}
      <Dialog open={!!currentPermission} onOpenChange={(open) => !open && setCurrentPermission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">{`${currentPermission?.method || ''} ${currentPermission?.path || ''}`}</DialogTitle>
            <DialogDescription>{currentPermission?.description}</DialogDescription>
          </DialogHeader>
          {currentPermission && (
            <CreatePermissionForm
              permissionData={currentPermission}
              onUpdateSuccess={() => {
                setCurrentPermission(null)
                getAllPermissionsQuery.refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PermissionsTableContext.Provider>
  )
}
