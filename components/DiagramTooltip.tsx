'use client'

import {
  useState,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
} from 'react'

export interface DiagramNodeData {
  id: string
  title: string
  subtitle?: string
  details?: string[]
  link?: { href: string; label: string }
}

interface ActiveNode extends DiagramNodeData {
  /** SVG x of the node rect */
  x: number
  /** SVG y of the node rect */
  y: number
  /** SVG width of the node rect */
  w: number
  /** SVG height of the node rect */
  h: number
}

interface DiagramTooltipProps {
  /** viewBox width of the parent SVG */
  viewBoxW: number
  /** viewBox height of the parent SVG */
  viewBoxH: number
  /** The active node to display, or null */
  active: ActiveNode | null
  /** Ref to the SVG element for coordinate mapping */
  svgRef: React.RefObject<SVGSVGElement | null>
  /** Called when the tooltip should close */
  onClose: () => void
}

export function DiagramTooltip({
  viewBoxW,
  viewBoxH,
  active,
  svgRef,
  onClose,
}: DiagramTooltipProps) {
  const [pos, setPos] = useState<{ left: number; top: number; flip: boolean } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const computePosition = useCallback(() => {
    if (!active || !svgRef.current) return
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const scaleX = rect.width / viewBoxW
    const scaleY = rect.height / viewBoxH

    const nodeCenterX = (active.x + active.w / 2) * scaleX
    const nodeTopY = active.y * scaleY
    const nodeBottomY = (active.y + active.h) * scaleY

    const cardW = 280
    const cardH = cardRef.current?.offsetHeight ?? 160
    const containerRect = svg.parentElement?.getBoundingClientRect()
    const containerLeft = containerRect?.left ?? rect.left
    const containerTop = containerRect?.top ?? rect.top

    let left = nodeCenterX - cardW / 2
    const flip = nodeTopY - cardH - 12 < 0
    const top = flip ? nodeBottomY + 12 : nodeTopY - cardH - 12

    const maxLeft = rect.width - cardW - 8
    if (left < 8) left = 8
    if (left > maxLeft) left = maxLeft

    setPos({ left, top, flip })
  }, [active, svgRef, viewBoxW, viewBoxH])

  useEffect(() => {
    if (active) {
      computePosition()
      window.addEventListener('scroll', computePosition, { passive: true })
      window.addEventListener('resize', computePosition)
      return () => {
        window.removeEventListener('scroll', computePosition)
        window.removeEventListener('resize', computePosition)
      }
    } else {
      setPos(null)
    }
  }, [active, computePosition])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onClose])

  if (!active || !pos) return null

  return (
    <div
      ref={cardRef}
      role="tooltip"
      aria-live="polite"
      className="diagram-tooltip"
      style={{
        position: 'absolute',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: 280,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div className="diagram-tooltip-card">
        <div className="diagram-tooltip-title">{active.title}</div>
        {active.subtitle && (
          <div className="diagram-tooltip-subtitle">{active.subtitle}</div>
        )}
        {active.details && active.details.length > 0 && (
          <ul className="diagram-tooltip-details">
            {active.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
        {active.link && (
          <a
            href={active.link.href}
            className="diagram-tooltip-link"
            style={{ pointerEvents: 'auto' }}
          >
            {active.link.label} →
          </a>
        )}
      </div>
      <div
        className={`diagram-tooltip-arrow ${pos.flip ? 'diagram-tooltip-arrow-top' : 'diagram-tooltip-arrow-bottom'}`}
        style={{ left: '50%' }}
      />
    </div>
  )
}

/** Hook to manage active node state for interactive diagrams */
export function useDiagramTooltip() {
  const [activeNode, setActiveNode] = useState<ActiveNode | null>(null)

  const showNode = useCallback((node: ActiveNode) => setActiveNode(node), [])
  const hideNode = useCallback(() => setActiveNode(null), [])
  const toggleNode = useCallback(
    (node: ActiveNode) =>
      setActiveNode((prev) => (prev?.id === node.id ? null : node)),
    [],
  )

  return { activeNode, showNode, hideNode, toggleNode }
}

/** Props for a `<g data-node>` wrapper */
export function nodeHandlers(
  node: ActiveNode,
  showNode: (n: ActiveNode) => void,
  hideNode: () => void,
  toggleNode: (n: ActiveNode) => void,
) {
  return {
    'data-node': node.id,
    tabIndex: 0,
    role: 'button',
    'aria-label': node.title,
    onMouseEnter: () => showNode(node),
    onMouseLeave: () => hideNode(),
    onFocus: () => showNode(node),
    onBlur: () => hideNode(),
    onClick: () => toggleNode(node),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') hideNode()
    },
  }
}
