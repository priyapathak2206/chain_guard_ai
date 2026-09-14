'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Container,
  Gauge,
  LayoutDashboard,
  MapPin,
  Menu,
  Package,
  PanelLeftClose,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getShipments, getFleet, getDisruptions, getColdChain, getDashboard, rerouteShipment, } from '@/lib/api'

type View =
  | 'dashboard'
  | 'shipments'
  | 'shipment'
  | 'fleet'
  | 'disruptions'
  | 'cold-chain'
  | 'recommendations'
  | 'bob'
type Shipment = {
  id: string
  route: string
  carrier: string
  status: string
  eta: string
  score: number
  cargo: string
  temp: string
  color: string
  disruption?: string
  assignedVehicle?: string
}

const nav = [
  { id: 'dashboard', label: 'Control Tower', icon: LayoutDashboard },
  { id: 'shipments', label: 'Shipments', icon: Package },
  { id: 'fleet', label: 'Fleet & Assets', icon: Truck },
  { id: 'disruptions', label: 'Disruptions', icon: AlertTriangle },
  { id: 'cold-chain', label: 'Cold Chain', icon: Snowflake },
  { id: 'recommendations', label: 'Recommendations', icon: Zap },
]
const mapShipment = (s: any): Shipment => ({
  id: s.shipmentId,

  route: `${s.origin} → ${s.destination}`,

  carrier: s.carrierId ?? 'Unknown Carrier',

  status:
    s.status === 'Disrupted'
      ? 'At Risk'
      : s.status === 'In Transit'
        ? 'In Transit'
        : s.status === 'Delivered'
          ? 'Delivered'
          : s.status === 'Rerouted'
            ? 'Rerouted'
            : 'Delayed',

  eta: s.deadline ? new Date(s.deadline).toLocaleDateString() : '—',

  score: s.riskScore ?? 0,

  cargo: s.cargoType ?? 'Unknown',

  temp:
    s.coldChain && s.temperatureMin !== undefined && s.temperatureMax !== undefined
      ? `${s.temperatureMin}–${s.temperatureMax}°C`
      : '—',

  color: s.riskScore >= 80 ? 'red' : s.riskScore >= 60 ? 'amber' : 'green',

  disruption: s.status === 'Disrupted' ? 'Active disruption' : undefined,

  assignedVehicle: s.vehicleId,
})



const util = [
  { name: 'In transit', value: 64, color: '#4f8cff' },
  { name: 'Available', value: 22, color: '#38c58a' },
  { name: 'Maintenance', value: 14, color: '#f2b84b' },
]

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}
function SectionHeading({
  title,
  sub,
  action,
}: {
  title: string
  sub?: string
  action?: React.ReactNode
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  )
}
function RiskBar({ score }: { score: number }) {
  return (
    <div className="risk-wrap">
      <div className="risk-track">
        <span
          style={{
            width: `${score}%`,
            background: score > 75 ? '#f06464' : score > 45 ? '#f2b84b' : '#38c58a',
          }}
        />
      </div>
      <strong className={score > 75 ? 'risk-high' : score > 45 ? 'risk-med' : 'risk-low'}>
        {score}
      </strong>
    </div>
  )
}
function MiniMap() {
  return (
    <div className="mini-map" aria-label="Simulated global shipment map">
      <div className="map-grid" />
      <svg viewBox="0 0 700 300" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M95 88 C155 62 180 105 215 128 S310 170 350 138 S430 105 480 144 S555 178 620 112"
          className="route-line route-muted"
        />
        <path
          d="M162 142 C225 120 275 116 340 139 S425 211 532 172"
          className="route-line route-blue"
        />
        <path d="M278 210 C350 180 405 154 480 142" className="route-line route-red" />
        <circle cx="162" cy="142" r="7" className="port-dot" />
        <circle cx="340" cy="139" r="7" className="port-dot" />
        <circle cx="532" cy="172" r="7" className="port-dot" />
        <circle cx="278" cy="210" r="8" className="port-dot danger" />
      </svg>
      <div className="map-label label-mumbai">
        Mumbai <span>●</span>
      </div>
      <div className="map-label label-frankfurt">Frankfurt</div>
      <div className="map-label label-rotterdam">Rotterdam</div>
      <div className="map-legend">
        <span>
          <i className="dot dot-blue" />
          On track
        </span>
        <span>
          <i className="dot dot-red" />
          At risk
        </span>
      </div>
    </div>
  )
}
function Header({
  onBob,
  onMenu,
  view,
  query,
  setQuery,
  onSearch,
}: {
  onBob: () => void
  onMenu: () => void
  view: View
  query: string
  setQuery: (s: string) => void
  onSearch: () => void
}) {
  const title =
    view === 'dashboard'
      ? 'Good afternoon, Alex'
      : view === 'shipment'
        ? 'Shipment details'
        : (nav.find((x) => x.id === view)?.label ?? 'Ask Bob')
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation">
        <Menu size={20} />
      </button>
      <div>
        <div className="eyebrow">MONDAY, MARCH 16, 2026 · 14:38 UTC</div>
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        <label className="search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Search shipments, routes..."
          />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button notification" aria-label="Notifications">
          <Bell size={18} />
          <i />
        </button>
        <button className="bob-button" onClick={onBob}>
          <Bot size={17} /> Ask Bob
        </button>
        <div className="avatar">AR</div>
      </div>
    </header>
  )
}
function Sidebar({
  view,
  setView,
  open,
}: {
  view: View
  setView: (v: View) => void
  open: boolean
}) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark">
          <ShieldCheck size={19} />
        </div>
        <span>ChainGuard</span>
        <span className="brand-ai">AI</span>
        <button className="collapse">
          <PanelLeftClose size={16} />
        </button>
      </div>
      <div className="workspace">
        <div className="workspace-icon">N</div>
        <div>
          <strong>Northstar Logistics</strong>
          <small>Global Operations</small>
        </div>
      </div>
      <nav>
        <div className="nav-label">WORKSPACE</div>
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {['shipments', 'disruptions', 'recommendations'].includes(item.id) && (
                <span className={`nav-count ${item.id === 'disruptions' ? 'count-alert' : ''}`}>
                  {item.id === 'shipments' ? '24' : item.id === 'disruptions' ? '3' : '5'}
                </span>
              )}
            </button>
          )
        })}
        <div className="nav-label nav-label-spaced">TOOLS</div>
        <button
          className={`nav-item ${view === 'bob' ? 'active' : ''}`}
          onClick={() => setView('bob')}
        >
          <Bot size={17} />
          <span>Ask Bob</span>
          <span className="new-pill">NEW</span>
        </button>
        <button className="nav-item">
          <Settings2 size={17} />
          <span>Settings</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="live-dot" />
          <div>
            <strong>Demo environment</strong>
            <small>Simulated operations data</small>
          </div>
        </div>
        <div className="user-row">
          <div className="avatar">AR</div>
          <div>
            <strong>Alex Rivera</strong>
            <small>Operations Lead</small>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Dashboard({
  shipments,
  dashboard,
  setView,
  toast,
}: {
  shipments: Shipment[]
  dashboard: any
  setView: (v: View) => void
  toast: (s: string) => void
}) {
  const critical = shipments.filter((s) => s.score >= 80).length
  return (
    <div className="page-content">
      <div className="alert-banner">
        <div className="alert-icon">
          <AlertTriangle size={18} />
        </div>
        <div>
          <strong>SIMULATED DEMO EVENT · Mumbai Port Strike</strong>
          <span>
            Impact analysis: 6 shipments affected ·{' '}
            <button onClick={() => setView('disruptions')}>
              Review disruptions <ChevronRight size={13} />
            </button>
          </span>
        </div>
        <button
          className="banner-close"
          aria-label="Dismiss"
          onClick={() => toast('Alert banner dismissed')}
        >
          <X size={16} />
        </button>
      </div>
      <div className="stats-grid">
        <button className="card stat-card" onClick={() => setView('disruptions')}>
          <div className="stat-top">
            <span>Active disruptions</span>
            <span className="stat-icon red">
              <AlertTriangle size={16} />
            </span>
          </div>
          <div className="stat-number">
   {dashboard?.disruptions?.active ?? 0}
</div>
          <div className="stat-meta down">
            <ArrowDownRight size={14} /> Requires attention
          </div>
        </button>
        <button className="card stat-card" onClick={() => setView('shipments')}>
          <div className="stat-top">
            <span>Affected shipments</span>
            <span className="stat-icon amber">
              <Package size={16} />
            </span>
          </div>
          <div className="stat-number">
  {dashboard?.shipments?.total ?? shipments.length}
</div>

<div className="stat-meta neutral">
  Total shipments
</div>
        </button>
        <button className="card stat-card" onClick={() => setView('shipments')}>
          <div className="stat-top">
            <span>Critical shipments</span>
            <span className="stat-icon red">
              <Gauge size={16} />
            </span>
          </div>
          <div className="stat-number">
  {dashboard?.shipments?.critical ?? critical}
</div>
          <div className="stat-meta down">Risk &gt; 80 · View queue</div>
        </button>
        <button className="card stat-card" onClick={() => setView('fleet')}>
          <div className="stat-top">
            <span>Idle vehicles</span>
            <span className="stat-icon green">
              <Truck size={16} />
            </span>
          </div>
          <div className="stat-number">
  {dashboard?.fleet?.idle ?? 0}
</div>
          <div className="stat-meta up">
            <ArrowUpRight size={14} /> Ready for redeployment
          </div>
        </button>
        <button className="card stat-card" onClick={() => setView('cold-chain')}>
          <div className="stat-top">
            <span>Cold-chain alerts</span>
            <span className="stat-icon blue">
              <Snowflake size={16} />
            </span>
          </div>
          <div className="stat-number">
  {dashboard?.coldChain?.monitored ?? 0}
</div>
          <div className="stat-meta neutral">
  Monitored containers
</div>
        </button>
      </div>
      <div className="dashboard-grid">
        <Card className="map-card">
          <SectionHeading
            title="Global network overview"
            sub="Simulated position and risk across your supply chain"
            action={
              <button className="ghost-button" onClick={() => toast('Network data refreshed')}>
                <RefreshCw size={14} /> Refresh
              </button>
            }
          />
          <MiniMap />
        </Card>
        <Card className="risk-card">
          <SectionHeading
            title="Shipment risk overview"
            sub="Transparent risk scoring from 0–100"
          />
          <div className="risk-summary-row">
            <div>
              <strong>
  {shipments.length > 0
    ? Math.round(
        shipments.reduce((a, s) => a + s.score, 0) /
          shipments.length
      )
    : 0}
</strong>
              <span>Network risk</span>
            </div>
            <div className="risk-bars">
  <span>
    <i style={{ width: '18%' }} />
    Critical <b>{dashboard?.shipments?.critical ?? critical}</b>
  </span>

  <span>
    <i className="amber-fill" style={{ width: '43%' }} />
    High <b>{dashboard?.shipments?.high ?? 0}</b>
  </span>

  <span>
    <i className="green-fill" style={{ width: '75%' }} />
    Low <b>{dashboard?.shipments?.low ?? 0}</b>
  </span>
</div>

          </div>
          <div className="attention">
            <div className="attention-head">
              <strong>Shipments needing attention</strong>
              <button onClick={() => setView('shipments')}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            {shipments
              .filter((s) => s.score > 60)
              .slice(0, 3)
              .map((s) => (
                <button className="attention-row" key={s.id} onClick={() => setView('shipment')}>
                  <span>
                    <b>{s.id}</b>
                    <small>{s.route}</small>
                  </span>
                  <RiskBar score={s.score} />
                </button>
              ))}
          </div>
        </Card>
      </div>
      <div className="lower-grid">
        <Card>
          <SectionHeading title="What should you do now?" sub="AI-ranked operational actions" />
          <div className="action-list">
            <button onClick={() => setView('recommendations')}>
              <span className="action-icon red">
                <AlertTriangle size={16} />
              </span>
              <span>
                <b>Reroute SH1024 via Mundra</b>
                <small>Reduce predicted delay by 5.2 hours · 94% confidence</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setView('fleet')}>
              <span className="action-icon green">
                <Truck size={16} />
              </span>
              <span>
                <b>Assign VH-021 to critical cargo</b>
                <small>Refrigerated vehicle available 12 km away</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setView('cold-chain')}>
              <span className="action-icon amber">
                <Snowflake size={16} />
              </span>
              <span>
                <b>Investigate TR-41 temperature excursion</b>
                <small>9.7°C · 18 minutes outside safe range</small>
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </Card>
        <Card>
          <SectionHeading title="Recent activity" sub="Updated from simulated operations" />
          <div className="activity-list">
            <div>
              <span className="activity-dot critical" />
              <p>
                <b>Temperature excursion detected</b>
                <small>SH1024 · 14:32</small>
              </p>
            </div>
            <div>
              <span className="activity-dot warning" />
              <p>
                <b>Port disruption escalated</b>
                <small>Mumbai Port Strike · 13:58</small>
              </p>
            </div>
            <div>
              <span className="activity-dot success" />
              <p>
                <b>Shipment delivered</b>
                <small>SH1016 · 12:44</small>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Shipments({ shipments, setView }: { shipments: Shipment[]; setView: (v: View) => void }) {
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState('all')
  const filtered = shipments
    .filter((s) =>
      `${s.id} ${s.route} ${s.carrier} ${s.cargo}`.toLowerCase().includes(query.toLowerCase()),
    )
    .filter(
      (s) =>
        risk === 'all' ||
        (risk === 'critical' && s.score >= 80) ||
        (risk === 'high' && s.score >= 60 && s.score < 80) ||
        (risk === 'low' && s.score < 60),
    )
  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <p className="page-kicker">NETWORK INVENTORY · DEMO DATA</p>
          <h2>
            All shipments <span className="title-count">{filtered.length} shown</span>
          </h2>
        </div>
      </div>
      <Card>
        <div className="filter-bar">
          <label className="search table-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, route, carrier, or cargo"
            />
          </label>
          <button
            className={`filter-button ${risk === 'critical' ? 'selected' : ''}`}
            onClick={() => setRisk(risk === 'critical' ? 'all' : 'critical')}
          >
            Critical
          </button>
          <button
            className={`filter-button ${risk === 'high' ? 'selected' : ''}`}
            onClick={() => setRisk(risk === 'high' ? 'all' : 'high')}
          >
            High
          </button>
          <button
            className="filter-button"
            onClick={() => {
              setQuery('')
              setRisk('all')
            }}
          >
            Reset
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Route</th>
                <th>Status</th>
                <th>ETA</th>
                <th>Risk score</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => setView('shipment')}>
                  <td>
                    <strong className="shipment-id">{s.id}</strong>
                    <small>
                      {s.cargo} · {s.carrier}
                    </small>
                  </td>
                  <td>
                    <span className="route-cell">
                      <MapPin size={13} />
                      {s.route}
                    </span>
                  </td>
                  <td>
                    <Badge tone={s.color}>{s.status}</Badge>
                  </td>
                  <td>{s.eta}</td>
                  <td>
                    <RiskBar score={s.score} />
                  </td>
                  <td>
                    <ChevronRight size={16} className="row-chevron" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={22} />
              <strong>No shipments found</strong>
              <span>Try a different search or reset your filters.</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function ShipmentDetail({
  shipment,
  onReroute,
  onAssign,
  toast,
}: {
  shipment: Shipment
  onReroute: () => void
  onAssign: () => void
  toast: (s: string) => void
}) {
  return (
    <div className="page-content">
      <div className="detail-back" onClick={() => window.history.back()}>
        <ChevronRight size={15} style={{ transform: 'rotate(180deg)' }} /> Back to shipments
      </div>
      <div className="detail-header">
        <div>
          <p className="page-kicker">SHIPMENT · OCEAN FREIGHT · SIMULATED</p>
          <h2>
            {shipment.id} <Badge tone={shipment.color}>{shipment.status}</Badge>
          </h2>
          <p>
            {shipment.route} <span className="muted-dot">·</span> {shipment.carrier}{' '}
            <span className="muted-dot">·</span> {shipment.cargo}
          </p>
        </div>
        <div className="detail-actions">
          <button className="ghost-button" onClick={() => toast('Shipment tracking link copied')}>
            <Send size={14} /> Share tracking
          </button>
          <button className="primary-button" onClick={onReroute}>
            Apply reroute
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <Card className="detail-map">
          <SectionHeading
            title="Route and disruption impact"
            sub="Current route is exposed to Mumbai Port Strike"
          />
          <MiniMap />
          <div className="route-stops">
            <div>
              <span className="stop-dot done" />
              <strong>Mumbai Port</strong>
              <small>Origin · disruption active</small>
            </div>
            <div className="route-progress">
              <span style={{ width: '42%' }} />
            </div>
            <div>
              <span className="stop-dot current" />
              <strong>Arabian Sea</strong>
              <small>Current location · predicted delay 8.2h</small>
            </div>
            <div>
              <span className="stop-dot pending" />
              <strong>Frankfurt Hub</strong>
              <small>Original ETA · {shipment.eta}</small>
            </div>
          </div>
        </Card>
        <Card className="risk-summary">
          <SectionHeading title="Risk assessment" sub="Why this score exists" />
          <div className="big-risk">
            <span>{shipment.score}</span>
            <small>/100</small>
            <Badge tone="red">Critical</Badge>
          </div>
          <p className="risk-explanation">
            Risk is calculated from disruption severity, predicted delay, priority, route exposure,
            carrier reliability, and cold-chain status.
          </p>
          <div className="risk-breakdown">
            <div>
              <span>Mumbai Port Strike</span>
              <b>+62</b>
            </div>
            <div>
              <span>Predicted delay 8.2h</span>
              <b>+18</b>
            </div>
            <div>
              <span>Carrier reliability</span>
              <b>+14</b>
            </div>
          </div>
        </Card>
      </div>
      <Card className="timeline-card">
        <SectionHeading
          title="AI mitigation plan"
          sub="Alternatives ranked by risk, delay, cost, and capacity"
        />
        <div className="route-options">
          <div className="route-option recommended">
            <div>
              <Badge tone="green">Recommended · 91/100</Badge>
              <h3>Mundra → Frankfurt</h3>
              <p>Lower disruption exposure · Carrier reliability 91% · Capacity available</p>
            </div>
            <div>
              <strong>4.8h</strong>
              <small>predicted delay</small>
              <button className="primary-button" onClick={onReroute}>
                Apply reroute
              </button>
            </div>
          </div>
          <div className="route-option">
            <div>
              <Badge tone="amber">Alternative · 74/100</Badge>
              <h3>Chennai → Frankfurt</h3>
              <p>Available capacity · +8% cost · Carrier reliability 86%</p>
            </div>
            <div>
              <strong>9.2h</strong>
              <small>predicted delay</small>
              <button className="ghost-button" onClick={() => toast('Route comparison opened')}>
                View route
              </button>
            </div>
          </div>
        </div>
      </Card>
      <Card className="assignment-card">
        <SectionHeading title="Fleet redeployment" sub="Best match for a high-priority shipment" />
        <div className="assignment">
          <div>
            <div className="vehicle-match">
              <Truck size={18} />
              <strong>VH-021 · Refrigerated truck</strong>
              <Badge tone="green">94% match</Badge>
            </div>
            <p>14 tons capacity · Mundra Hub · 12 km away · Available now · Cold-chain capable</p>
          </div>
          <button className="primary-button" onClick={onAssign}>
            {shipment.assignedVehicle ? (
              <>
                <Check size={15} /> Assigned
              </>
            ) : (
              'Assign vehicle'
            )}
          </button>
        </div>
      </Card>
    </div>
  )
}

function Fleet({  vehicles,
  onAssign,
  toast,
}: {
  vehicles: any[]
  onAssign: () => void
  toast: (message: string) => void
}) {

  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <p className="page-kicker">ASSET VISIBILITY · DEMO DATA</p>
          <h2>Fleet & assets</h2>
        </div>
        <button className="ghost-button" onClick={() => toast('Fleet telemetry refreshed')}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <div className="stats-grid">
        <Card>
          <div className="stat-top">
            <span>Total vehicles</span>
            <span className="stat-icon blue">
              <Truck size={16} />
            </span>
          </div>
          <div className="stat-number">186</div>
          <div className="stat-meta neutral">12 regions</div>
        </Card>
        <Card>
          <div className="stat-top">
            <span>Available now</span>
            <span className="stat-icon green">
              <Check size={16} />
            </span>
          </div>
          <div className="stat-number">12</div>
          <div className="stat-meta up">Best match VH-021 · 94%</div>
        </Card>
        <Card>
          <div className="stat-top">
            <span>Utilization</span>
            <span className="stat-icon amber">
              <Activity size={16} />
            </span>
          </div>
          <div className="stat-number">78.6%</div>
          <div className="stat-meta up">
            <ArrowUpRight size={14} /> 4.6% this month
          </div>
        </Card>
      </div>
      <div className="fleet-grid">
        <Card>
          <SectionHeading title="Fleet utilization" sub="Allocation by status" />
          <div className="donut-wrap">
            <ResponsiveContainer width="52%" height={220}>
              <PieChart>
                <Pie
                  data={util}
                  dataKey="value"
                  innerRadius={64}
                  outerRadius={88}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {util.map((x) => (
                    <Cell key={x.name} fill={x.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-legend">
              {util.map((x) => (
                <div key={x.name}>
                  <i style={{ background: x.color }} />
                  <span>{x.name}</span>
                  <b>{x.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <SectionHeading
            title="Redeployment candidates"
            sub="Vehicles matched to critical shipments"
          />
          <div className="vehicle-list">
            {vehicles.map((v) => (
              <div className="vehicle-row" key={v.vehicleId}>
                <div className="vehicle-icon">
                  <Truck size={16} />
                </div>
                <div>
                  <b>
                    {v.id} · {v.type}
                  </b>
                  <small>
                    {v.location} · {v.capacity} · {v.cold ? 'Cold-chain capable' : 'Standard cargo'}
                  </small>
                </div>
                <Badge
                  tone={
                    v.status === 'Available'
                      ? 'green'
                      : v.status === 'Maintenance'
                        ? 'amber'
                        : 'blue'
                  }
                >
                  {v.status}
                </Badge>
                {v.id === 'VH-021' && (
                  <button className="icon-button" aria-label="Assign VH-021" onClick={onAssign}>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Disruptions({
  disruptions,
  toast,
  setView,
}: {
  disruptions: any[]
  toast: (s: string) => void
  setView: (v: View) => void
}) {
  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <p className="page-kicker">NETWORK EVENTS · SIMULATED</p>
          <h2>
  Disruptions{' '}
  <span className="title-count">
    {disruptions.length} active
  </span>
</h2>
        </div>
        <button className="ghost-button" onClick={() => toast('Disruption feed refreshed')}>
          <RefreshCw size={14} /> Refresh feed
        </button>
      </div>
      
      <div className="disruption-list">
  {disruptions.map((d) => (
    <Card
      className="disruption-card"
      key={d.disruptionId}
    >
      <div
        className={`disruption-symbol ${
          d.severity === 'Critical' ? 'red' : 'amber'
        }`}
      >
        <AlertTriangle size={21} />
      </div>

      <div className="disruption-main">
        <div className="disruption-title">
          <h3>{d.title || d.name}</h3>

          <Badge
            tone={
              d.severity === 'Critical'
                ? 'red'
                : 'amber'
            }
          >
            {d.severity}
          </Badge>
        </div>

        <p>
          {d.type || 'Network disruption'} ·{' '}
          {d.location || 'Unknown location'}
        </p>

        <div className="disruption-meta">
          <span>
            <Package size={13} />
            {d.affectedShipments || 0} shipments affected
          </span>

          <span>
            <Clock3 size={13} />
            Avg delay {d.averageDelay || 0}h
          </span>
        </div>
      </div>

      <button
        className="ghost-button"
        onClick={() =>
          toast(`${d.title || d.name} details opened`)
        }
      >
        View details
      </button>
    </Card>
  ))}
</div>
      
    </div>
  )
}

function ColdChain({
  coldChain,
  toast,
}: {
  coldChain: any[]
  toast: (s: string) => void
}) {
    const temperatureData = coldChain.map((item) => ({
    t: item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : item.t ?? '',
    v: item.temperature ?? item.v ?? 0,
  }))

  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <p className="page-kicker">SENSITIVE CARGO · SIMULATED SENSORS</p>
          <h2>Cold chain monitoring</h2>
        </div>
        <button className="ghost-button" onClick={() => toast('Temperature data refreshed')}>
          <RefreshCw size={14} /> Sync sensors
        </button>
      </div>
      <div className="stats-grid">
        <Card>
          <div className="stat-top">
            <span>Monitored containers</span>
            <span className="stat-icon blue">
              <Snowflake size={16} />
            </span>
          </div>
          <div className="stat-number">
  {new Set(
    coldChain.map((item) => item.containerId)
  ).size}
</div>

<div className="stat-meta neutral">
  Across {new Set(
    coldChain.map((item) => item.shipmentId)
  ).size} shipments
</div>
        </Card>
        <Card>
          <div className="stat-top">
            <span>Within range</span>
            <span className="stat-icon green">
              <Check size={16} />
            </span>
          </div>
          <div className="stat-number">
  {coldChain.length
    ? (
        (coldChain.filter(
          (item) =>
            Number(item.temperature ?? item.v ?? 0) >= 2 &&
            Number(item.temperature ?? item.v ?? 0) <= 8
        ).length /
          coldChain.length) *
        100
      ).toFixed(1)
    : '0.0'}
  %
</div>

<div className="stat-meta up">
  Safe range 2°C – 8°C
</div>
        </Card>
        <Card>
          <div className="stat-top">
            <span>Active excursions</span>
            <span className="stat-icon red">
              <AlertTriangle size={16} />
            </span>
          </div>
          <div className="stat-number">
  {coldChain.filter(
    (item) => {
      const temp = Number(item.temperature ?? item.v ?? 0)
      return temp < 2 || temp > 8
    }
  ).length}
</div>

<div className="stat-meta down">
  Needs attention
</div>
        </Card>
      </div>
      <div className="cold-grid">
        <Card className="temperature-card">
          <SectionHeading
  title={
    coldChain.length
      ? `${coldChain[0].containerId ?? 'Container'} · ${
          coldChain[0].shipmentId ?? 'Shipment'
        }`
      : 'Cold chain monitoring'
  }
  sub="Live sensor readings"
  action={
    <Badge
      tone={
        coldChain.some((item) => {
          const temp = Number(item.temperature ?? item.v ?? 0)
          return temp < 2 || temp > 8
        })
          ? 'red'
          : 'green'
      }
    >
      {coldChain.some((item) => {
        const temp = Number(item.temperature ?? item.v ?? 0)
        return temp < 2 || temp > 8
      })
        ? 'Major excursion'
        : 'Within range'}
    </Badge>
  }
/>
          <div className="temp-current">
            <span>Current temperature</span>
            <strong>
  {coldChain.length
    ? Number(
        coldChain[coldChain.length - 1].temperature ??
        coldChain[coldChain.length - 1].v ??
        0
      ).toFixed(1)
    : '0.0'}
  °C
</strong>

<small>
  Current sensor reading
</small>
          </div>
           <ResponsiveContainer width="100%" height={210}>
  <AreaChart data={temperatureData}>
    <CartesianGrid
      stroke="#253552"
      strokeDasharray="3 3"
      vertical={false}
    />

    <XAxis
      dataKey="t"
      stroke="#71809a"
      tickLine={false}
      axisLine={false}
      fontSize={11}
    />

    <YAxis
      domain={[0, 12]}
      stroke="#71809a"
      tickLine={false}
      axisLine={false}
      fontSize={11}
    />

    <Tooltip
      contentStyle={{
        background: '#152038',
        border: '1px solid #2b3b58',
        borderRadius: 8,
      }}
    />

    <Area
      type="monotone"
      dataKey="v"
      stroke="#f06464"
      fill="#f0646422"
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>
          <div className="chart-note">
            <span>
              <i className="dot dot-green" />
              Safe range 2–8°C
            </span>
            <span>
              <i className="dot dot-red" />
              Excursion detected at 18:00
            </span>
          </div>
        </Card>
        <Card>
          <SectionHeading title="Operational response" sub="AI-generated recommendation" />
          <div className="response-box">
            <Badge tone="red">Action required</Badge>
            <h3>Deploy reefer backup</h3>
            <p>
              Assign VH-021 to SH1024 to isolate the temperature risk. Recheck sensor readings after
              handoff.
            </p>
            <button
              className="primary-button"
              onClick={() => toast('Backup reefer assignment queued')}
            >
              Acknowledge and act
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Recommendations({
  toast,
  onReroute,
  onAssign,
}: {
  toast: (s: string) => void
  onReroute: () => void
  onAssign: () => void
}) {
  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <p className="page-kicker">AI-POWERED ACTIONS · EXPLAINABLE</p>
          <h2>
            Recommendations <span className="title-count">5 available</span>
          </h2>
        </div>
        <button
          className="ghost-button"
          onClick={() => toast('Recommendations recalculated from current demo data')}
        >
          <RefreshCw size={14} /> Recalculate
        </button>
      </div>
      <div className="recommendation-intro">
        <div className="bob-avatar">
          <Bot size={22} />
        </div>
        <div>
          <strong>Bob found 5 ways to reduce network risk</strong>
          <p>
            Actions are ranked by impact, urgency, and confidence based on the current simulated
            operation.
          </p>
        </div>
      </div>
      <div className="recommendation-list">
        <Card className="recommendation-card">
          <div className="rec-number red">01</div>
          <div className="rec-main">
            <div className="rec-title">
              <h3>Reroute SH1024 via Mundra</h3>
              <Badge tone="red">High impact</Badge>
            </div>
            <p>
              Current route is exposed to Mumbai Port Strike. Mundra has available capacity and
              lower disruption exposure.
            </p>
            <div className="rec-meta">
              <span>
                <ShieldCheck size={13} /> 94% confidence
              </span>
              <span>Expected delay reduction: 5.2h</span>
            </div>
          </div>
          <button className="primary-button" onClick={onReroute}>
            Apply reroute
          </button>
        </Card>
        <Card className="recommendation-card">
          <div className="rec-number green">02</div>
          <div className="rec-main">
            <div className="rec-title">
              <h3>Redeploy VH-021 to SH1024</h3>
              <Badge tone="green">Time sensitive</Badge>
            </div>
            <p>Refrigerated truck is 12 km away with 14-ton capacity and is available now.</p>
            <div className="rec-meta">
              <span>
                <ShieldCheck size={13} /> 94% match
              </span>
              <span>Protects cold-chain cargo</span>
            </div>
          </div>
          <button className="primary-button" onClick={onAssign}>
            Assign vehicle
          </button>
        </Card>
      </div>
    </div>
  )
}

function Bob({
  close,
  shipments,
  onAssign,
}: {
  close?: () => void
  shipments: Shipment[]
  onAssign: () => void
}) {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([])
  const [input, setInput] = useState('')
  const prompts = [
    'Which shipment should I prioritize?',
    'Why is SH1024 critical?',
    'Show cold-chain alerts',
  ]
  const answer = (q: string) => {
    const l = q.toLowerCase()
    if (l.includes('vehicle') || l.includes('assign'))
      return 'VH-021 is the best match: 94% score, 14 tons, refrigerated, 12 km from Mundra, and available now. I recommend assigning it to SH1024. Would you like me to apply that assignment?'
    if (l.includes('cold'))
      return 'There is 1 active cold-chain alert. TR-41 on SH1024 is at 9.7°C, 18 minutes outside the 2–8°C safe range. Deploying VH-021 is the recommended response.'
    if (l.includes('sh1024') || l.includes('critical') || l.includes('prioritize'))
      return `Prioritize SH1024. Risk is ${shipments.find((s) => s.id === 'SH1024')?.score ?? 94}/100 — Critical. The Mumbai Port Strike adds 62 points, predicted delay adds 18, and carrier reliability adds 14. Reroute via Mundra and assign refrigerated vehicle VH-021.`
    return 'I found 3 items requiring attention: SH1024 is critical, the Mumbai Port Strike affects 6 shipments, and TR-41 has a temperature excursion. Ask me about a shipment, disruption, route, vehicle, or cold-chain alert.'
  }
  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((x) => [...x, { from: 'user', text }, { from: 'bob', text: answer(text) }])
    setInput('')
  }
  return (
    <div className={close ? 'bob-panel' : 'page-content bob-page'}>
      {close && (
        <div className="bob-panel-head">
          <div className="bob-avatar">
            <Bot size={21} />
          </div>
          <div>
            <strong>Ask Bob</strong>
            <small>
              ChainGuard operations copilot <span className="live-dot" />
            </small>
          </div>
          <button className="icon-button" onClick={close}>
            <X size={18} />
          </button>
        </div>
      )}
      <div className="bob-body">
        {messages.length === 0 ? (
          <div className="bob-welcome">
            <div className="bob-hero">
              <Bot size={28} />
            </div>
            <h3>Ask Bob about your operation</h3>
            <p>
              Answers use ChainGuard&apos;s current simulated data and explain the reasoning behind
              each action.
            </p>
            <div className="prompt-list">
              {prompts.map((p) => (
                <button key={p} onClick={() => send(p)}>
                  {p}
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((m, i) => (
              <div className={`message ${m.from}`} key={i}>
                <div className="message-avatar">{m.from === 'bob' ? <Bot size={14} /> : 'AR'}</div>
                <p>
                  {m.text}
                  {m.from === 'bob' && m.text.includes('Would you') && (
                    <button className="inline-action" onClick={onAssign}>
                      Confirm assignment
                    </button>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bob-composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) send(input)
          }}
          placeholder="Ask Bob anything..."
        />
        <button onClick={() => send(input)} aria-label="Send message">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  const [view, setView] = useState<View>('dashboard')

  const [shipments, setShipments] = useState<Shipment[]>([])
  const [fleet, setFleet] = useState<any[]>([])
  const [disruptions, setDisruptions] = useState<any[]>([])
  const [coldChain, setColdChain] = useState<any[]>([])
  const [dashboard, setDashboard] = useState<any>(null)

  const [loadingShipments, setLoadingShipments] = useState(true)
  const [shipmentError, setShipmentError] = useState('')


    useEffect(() => {
    const loadShipments = async () => {
      try {
        setLoadingShipments(true)

        const data = await getShipments()

        const formattedShipments = data.map(mapShipment)

        setShipments(formattedShipments)
      } catch (error) {
        console.error('Failed to load shipments:', error)

        setShipmentError(
          'Unable to load shipments from backend'
        )
      } finally {
        setLoadingShipments(false)
      }
    }

    loadShipments()
  }, [])

useEffect(() => {
  getFleet()
    .then((data) => {
      setFleet(data)
    })
    .catch((error) => {
      console.error('Failed to load fleet:', error)
    })
}, [])

useEffect(() => {
  getDisruptions()
    .then((data) => {
      setDisruptions(data)
    })
    .catch((error) => {
      console.error('Failed to load disruptions:', error)
    })
}, [])

useEffect(() => {
  getColdChain()
    .then((data) => {
      setColdChain(data)
    })
    .catch((error) => {
      console.error('Failed to load cold-chain data:', error)
    })
}, [])

useEffect(() => {
  getDashboard()
    .then((data) => {
      setDashboard(data)
    })
    .catch((error) => {
      console.error('Failed to load dashboard:', error)
    })
}, [])


  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bobOpen, setBobOpen] = useState(false)
  const [toastText, setToastText] = useState('')
  const [globalQuery, setGlobalQuery] = useState('')
  const toast = (s: string) => {
    setToastText(s)
    window.setTimeout(() => setToastText(''), 2600)
  }
  const selected = shipments.find((s) => s.id === 'SH1024') ?? shipments[0]
  
  const reroute = async () => {
  try {
    const updated = await rerouteShipment(
      'SH1024',
      'Mundra → Frankfurt'
    )

    setShipments((xs) =>
      xs.map((s) =>
        s.id === 'SH1024'
          ? {
              ...s,
              route:
                updated.shipment?.origin &&
                updated.shipment?.destination
                  ? `${updated.shipment.origin} → ${updated.shipment.destination}`
                  : 'Mundra → Frankfurt',
              score: updated.shipment?.riskScore ?? 42,
              status: updated.shipment?.status ?? 'Rerouted',
              color: 'green',
              disruption: undefined,
            }
          : s,
      ),
    )

    toast('SH1024 rerouted via Mundra')
    setView('shipment')
  } catch (error) {
    console.error('Reroute failed:', error)
    toast('Failed to reroute SH1024')
  }
}
  const assign = () => {
    setShipments((xs) =>
      xs.map((s) =>
        s.id === 'SH1024'
          ? { ...s, assignedVehicle: 'VH-021', score: Math.max(20, s.score - 8) }
          : s,
      ),
    )
    toast('VH-021 assigned to SH1024 · activity logged')
  }
  const search = () => {
    if (globalQuery.toLowerCase().includes('sh1024')) setView('shipment')
    else if (
      globalQuery.toLowerCase().includes('vehicle') ||
      globalQuery.toLowerCase().includes('vh-')
    )
      setView('fleet')
    else if (globalQuery.toLowerCase().includes('mumbai')) setView('disruptions')
    else if (globalQuery) setView('shipments')
  }
  const content =
    view === 'dashboard' ? (
     <Dashboard
  shipments={shipments}
  dashboard={dashboard}
  setView={setView}
  toast={toast}
/> 
    ) : view === 'shipments' ? (
      <Shipments shipments={shipments} setView={setView} />
      
    ) : view === 'shipment' ? (
      selected ? (
    <ShipmentDetail
      shipment={selected}
      onReroute={reroute}
      onAssign={assign}
      toast={toast}
    />
  ) : (
    <div className="page-content">
      <div className="card">
        <h2>Loading shipment...</h2>
        <p>Please wait while shipment data is loaded.</p>
      </div>
    </div>
  )

    ) : view === 'fleet' ? (
  <Fleet
    vehicles={fleet}
    onAssign={assign}
    toast={toast}
  />

    ) : view === 'disruptions' ? (
  <Disruptions
    disruptions={disruptions}
    toast={toast}
    setView={setView}
  />

    ) : view === 'cold-chain' ? (
  <ColdChain
    coldChain={coldChain}
    toast={toast}
  />

    ) : view === 'recommendations' ? (
      <Recommendations toast={toast} onReroute={reroute} onAssign={assign} />
    ) : (
      <Bob shipments={shipments} onAssign={assign} />
    )
  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={(v) => {
          setView(v)
          setSidebarOpen(false)
        }}
        open={sidebarOpen}
      />
      <main className="main">
        <Header
  view={view}
  onBob={() => setBobOpen(true)}
  onMenu={() => setSidebarOpen(true)}
  query={globalQuery}
  setQuery={setGlobalQuery}
  onSearch={search}
/>

{shipmentError && (
  <div className="page-content">
    <div className="card">
      <strong>Backend connection error</strong>
      <p>{shipmentError}</p>
    </div>
  </div>
)}

{content}
        {content}
      </main>
      {bobOpen && <Bob close={() => setBobOpen(false)} shipments={shipments} onAssign={assign} />}
      {toastText && (
        <div className="toast">
          <Check size={15} /> {toastText}
        </div>
      )}
    </div>
  )
}
