'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, XCircle, Eye, Calendar, Server, Plus, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { ServerOwnerRequestModal } from '@/components/modals/ServerOwnerRequestModal'
import { checkUserServerOwnerRequest, type CheckUserRequestResponse } from '@/services/server-owner-requests'

interface RequestData {
  id: number
  type: 'server_owner' | 'role_change' | 'support'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'in_review'
  createdAt: string
  updatedAt: string
  response?: string
}

export function MyRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RequestData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [userRequest, setUserRequest] = useState<CheckUserRequestResponse | null>(null)
  const [loadingRequest, setLoadingRequest] = useState(true)
  
  const canRequestServerOwner = user?.role === 'user'
  

  useEffect(() => {
    loadAllRequests()

    const onFocus = () => loadAllRequests()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') loadAllRequests()
    }
    // window.addEventListener('focus', onFocus)
    // document.addEventListener('visibilitychange', onVisibility)

    return () => {
      //  window.removeEventListener('focus', onFocus)
      // document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [canRequestServerOwner])

  const loadAllRequests = async () => {
    try {
      setIsLoading(true)
      // Load general requests (placeholder for now)
      // TODO: Implement fetchUserRequests API call
      // const response = await fetchUserRequests()
      // setRequests(response.data || [])
      setRequests([])

      if (canRequestServerOwner) {
        await loadServerOwnerRequest()
      }
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadServerOwnerRequest = async () => {
    try {
      setLoadingRequest(true)
      const response = await checkUserServerOwnerRequest()
      setUserRequest(response)
    } catch (error) {
      console.error('Failed to load server owner request:', error)
    } finally {
      setLoadingRequest(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline', text: 'Beklemede', color: 'text-yellow-600 border-yellow-600' },
      approved: { variant: 'default', text: 'Onaylandı', color: 'bg-green-500' },
      rejected: { variant: 'destructive', text: 'Reddedildi', color: 'bg-red-500' },
      in_review: { variant: 'secondary', text: 'İnceleniyor', color: 'bg-blue-500' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge variant={config.variant as any} className={config.color}>
        {config.text}
      </Badge>
    )
  }

  const getTypeLabel = (type: string) => {
    const typeConfig = {
      server_owner: 'Sunucu Sahibi Başvurusu',
      role_change: 'Rol Değişikliği',
      support: 'Destek Talebi'
    }
    return typeConfig[type as keyof typeof typeConfig] || type
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server_owner':
        return <Server className="w-4 h-4" />
      case 'role_change':
        return <FileText className="w-4 h-4" />
      case 'support':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const handleViewRequest = (requestId: number) => {
    // TODO: Show request details modalå
    console.log('View request clicked:', requestId)
  }

  const handleCreateServerOwnerRequest = () => {
    if (loadingRequest) return
    if (userRequest?.hasRequest) return
    setShowRequestModal(true)
  }

  const handleRequestSuccess = () => {
    loadAllRequests()
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Talepler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Taleplerim</h1>
          <p className="text-muted-foreground">Sunucu başvurularınızı ve destek taleplerinizi takip edin</p>
        </div>
        {canRequestServerOwner && !userRequest?.hasRequest && (
          <Button onClick={handleCreateServerOwnerRequest} disabled={loadingRequest} className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Sunucu Sahibi Başvurusu</span>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Talep</p>
                <p className="text-2xl font-bold text-foreground">{requests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold text-foreground">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Onaylanan</p>
                <p className="text-2xl font-bold text-foreground">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reddedilen</p>
                <p className="text-2xl font-bold text-foreground">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Owner Request Status */}
      {canRequestServerOwner && userRequest?.hasRequest && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Server Sahipliği Başvurusu
                  </h3>
                  {getStatusBadge(userRequest.request?.status || 'pending')}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {userRequest.request?.status === 'pending' && 'Başvurunuz inceleniyor...'}
                  {userRequest.request?.status === 'approved' && 'Başvurunuz onaylandı! Artık server oluşturabilirsiniz.'}
                  {userRequest.request?.status === 'rejected' && `Başvurunuz reddedildi. Sebep: ${userRequest.request?.rejectReason || 'Belirtilmemiş'}`}
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  <p>Talep Edilen Rol: {userRequest.request?.selectedUserTypeName}</p>
                  <p>Talep Tarihi: {new Date(userRequest.request?.createdAt || '').toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz talep göndermediniz</h3>
              <p className="text-muted-foreground mb-4">
                Sunucu sahibi olmak veya rol değişikliği için talep gönderin
              </p>
              {canRequestServerOwner && !userRequest?.hasRequest ? (
                <Button onClick={handleCreateServerOwnerRequest} disabled={loadingRequest} className="flex items-center space-x-2 mx-auto">
                  <Shield className="w-4 h-4" />
                  <span>Sunucu Sahibi Başvurusu</span>
                </Button>
              ) : (
                <></>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {getTypeIcon(request.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">{getTypeLabel(request.type)}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-muted-foreground">{request.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      {request.response && (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 dark:text-green-400">Yanıtlandı</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request.id)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Detayları Gör</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Server Owner Request Modal */}
      <ServerOwnerRequestModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        onSuccess={handleRequestSuccess}
      />
    </div>
  )
}
