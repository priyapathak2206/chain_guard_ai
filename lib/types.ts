// Domain types for ChainGuard AI
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'in-transit' | 'delayed' | 'at-risk' | 'delivered' | 'rerouted'
export type VehicleStatus = 'available' | 'assigned' | 'maintenance'
export type DisruptionSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RecommendationType = 'reroute' | 'redeploy' | 'switch-carrier' | 'monitor'

export interface Shipment {
  id: string
  cargo: string
  value: number
  origin: string
  destination: string
  currentLocation: string
  carrier: string
  eta: string
  predictedDelay: number
  riskScore: number
  riskLevel: RiskLevel
  status: Status
  route: string
  color: 'red' | 'amber' | 'blue' | 'green'
  temp?: string
  disruption?: string
  assignedVehicle?: string
  coldChainCapable?: boolean
  affectedByDisruptions?: string[]
}

export interface Vehicle {
  id: string
  type: string
  location: string
  capacity: string
  status: VehicleStatus
  utilization: number
  coldChainCapable: boolean
  assignment?: string
  reliability: number
}

export interface Disruption {
  id: string
  name: string
  type: string
  location: string
  severity: DisruptionSeverity
  status: 'active' | 'monitoring' | 'resolved'
  startTime: string
  expectedDuration: string
  affectedShipmentIds: string[]
  affectedRouteIds: string[]
  affectedCarriers: string[]
  estimatedDelay: number
  confidence: number
}

export interface Route {
  id: string
  origin: string
  destination: string
  predictedDelay: number
  cost: number
  riskLevel: RiskLevel
  recommended?: boolean
}

export interface Carrier {
  id: string
  name: string
  reliability: number
  capacity: 'available' | 'limited'
  costDelta: number
  predictedDelay: number
  riskLevel: RiskLevel
}

export interface ColdChainAlert {
  id: string
  shipmentId: string
  trackerId: string
  currentTemp: number
  safeRangeMin: number
  safeRangeMax: number
  excursionDuration: number
  severity: 'critical' | 'high' | 'medium'
  location: string
  status: 'active' | 'resolved'
}

export interface Recommendation {
  id: string
  type: RecommendationType
  title: string
  description: string
  shipmentId?: string
  vehicleId?: string
  carrierId?: string
  confidence: number
  expectedBenefit: string
  status: 'pending' | 'applied'
  impact: 'critical' | 'high' | 'medium'
}

export interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  severity?: 'critical' | 'normal'
  relatedId?: string
}

export interface DashboardMetrics {
  activeDisruptions: number
  affectedShipments: number
  criticalShipments: number
  idleVehicles: number
  coldChainAlerts: number
}

export interface NotificationItem {
  id: string
  type: 'critical' | 'disruption' | 'cold-chain' | 'vehicle' | 'risk' | 'recommendation'
  title: string
  description: string
  timestamp: string
  read: boolean
  actionId?: string
}
