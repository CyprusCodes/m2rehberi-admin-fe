'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, XCircle, Eye, Calendar, Server, Shield } from 'lucide-react'
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
      pending: {
        text: 'Beklemede',
        className: 'border-amber-400/40 bg-amber-500/10 text-amber-200'
      },
      approved: {
        text: 'Onaylandı',
        className: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
      },
      rejected: {
        text: 'Reddedildi',
        className: 'border-rose-400/40 bg-rose-500/10 text-rose-200'
      },
      in_review: {
        text: 'İnceleniyor',
        className: 'border-indigo-400/40 bg-indigo-500/10 text-indigo-200'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge
        variant="outline"
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
      >
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
        return <Server className="h-5 w-5 text-indigo-200" />
      case 'role_change':
        return <FileText className="h-5 w-5 text-indigo-200" />
      case 'support':
        return <FileText className="h-5 w-5 text-indigo-200" />
      default:
        return <FileText className="h-5 w-5 text-indigo-200" />
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

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const approvedCount = requests.filter(r => r.status === 'approved').length
  const rejectedCount = requests.filter(r => r.status === 'rejected').length

  const stats = [
    {
      label: 'Toplam Talep',
      value: requests.length,
      icon: FileText,
      accent: 'from-indigo-500/20 to-slate-500/20'
    },
    {
      label: 'Bekleyen',
      value: pendingCount,
      icon: Clock,
      accent: 'from-amber-500/20 to-slate-500/20'
    },
    {
      label: 'Onaylanan',
      value: approvedCount,
      icon: CheckCircle,
      accent: 'from-emerald-500/20 to-slate-500/20'
    },
    {
      label: 'Reddedilen',
      value: rejectedCount,
      icon: XCircle,
      accent: 'from-rose-500/20 to-slate-500/20'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-400 mx-auto" />
            <Shield className="absolute inset-0 m-auto h-6 w-6 text-indigo-200" />
          </div>
          <p className="text-sm text-slate-400">Talepler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-100">Taleplerim</h2>
          <p className="text-sm text-slate-400">Sunucu ve rol taleplerini tek panelden yönet.</p>
        </div>
        {canRequestServerOwner && !userRequest?.hasRequest && (
          <Button
            onClick={handleCreateServerOwnerRequest}
            disabled={loadingRequest}
            className="flex items-center gap-2 rounded-xl"
          >
            <Shield className="h-4 w-4" />
            <span>Sunucu Sahibi Başvurusu</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{item.value}</p>
                </div>
                <div className={`rounded-xl bg-gradient-to-br ${item.accent} p-3`}>
                  <Icon className="h-5 w-5 text-slate-100/80" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {canRequestServerOwner && userRequest?.hasRequest && (
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 via-slate-900/50 to-slate-900/70 p-6 shadow-xl shadow-black/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-indigo-500/20 p-3">
                <Shield className="h-5 w-5 text-indigo-200" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-100">Server Sahipliği Başvurusu</h3>
                  {getStatusBadge(userRequest.request?.status || 'pending')}
                </div>
                <p className="mt-2 max-w-2xl text-sm text-indigo-100/80">
                  {userRequest.request?.status === 'pending' && 'Başvurunuz inceleniyor. Moderatörlerimiz kısa süre içinde geri dönüş sağlayacak.'}
                  {userRequest.request?.status === 'approved' && 'Başvurunuz onaylandı! Artık server oluşturabilir ve yönetim araçlarını kullanabilirsiniz.'}
                  {userRequest.request?.status === 'rejected' && `Başvurunuz reddedildi. Sebep: ${userRequest.request?.rejectReason || 'Belirtilmedi'}`}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-indigo-100/70">
                  <span className="inline-flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full border border-indigo-400/40 bg-indigo-500/10 text-indigo-100">
                      {userRequest.request?.selectedUserTypeName || 'Sunucu Sahibi'}
                    </Badge>
                  </span>
                  <span>Talep Tarihi: {new Date(userRequest.request?.createdAt || '').toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/50 p-12 text-center shadow-xl shadow-black/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60">
            <FileText className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-slate-100">Henüz talep göndermediniz</h3>
          <p className="mt-2 text-sm text-slate-400">
            Sunucu sahibi olmak veya rol değişikliği için yeni bir başvuru oluşturabilirsiniz.
          </p>
          {canRequestServerOwner && !userRequest?.hasRequest && (
            <Button
              onClick={handleCreateServerOwnerRequest}
              disabled={loadingRequest}
              className="mt-6 inline-flex items-center gap-2 rounded-xl"
            >
              <Shield className="h-4 w-4" />
              <span>Sunucu Sahibi Başvurusu</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 shadow-lg shadow-black/30"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl bg-slate-800/80 p-3">
                      {getTypeIcon(request.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{request.title}</h3>
                      <p className="text-sm text-slate-400">{getTypeLabel(request.type)}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-slate-400">{request.description}</p>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {request.response && (
                      <span className="inline-flex items-center gap-2 text-emerald-300">
                        <CheckCircle className="h-4 w-4" />
                        Yanıtlandı
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRequest(request.id)}
                    className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-transparent text-slate-200 hover:border-indigo-400/40"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Detayları Gör</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServerOwnerRequestModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        onSuccess={handleRequestSuccess}
      />
    </div>
  )
}
