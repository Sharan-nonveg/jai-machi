declare module 'react-simple-maps' {
  import { FC, ReactNode, CSSProperties } from 'react'
  
  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, any>
    children?: ReactNode
    className?: string
    style?: CSSProperties
  }
  
  interface GeographyProps {
    geography?: string | any
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    children?: ReactNode | ((props: any) => ReactNode)
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: CSSProperties | Record<string, CSSProperties>
  }
  
  interface MarkersProps {
    children?: ReactNode
  }
  
  interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onClick?: () => void
  }
  
  interface LinesProps {
    children?: ReactNode
  }
  
  interface LineProps {
    from: [number, number]
    to: [number, number]
    children?: ReactNode
    stroke?: string
    strokeWidth?: number
    strokeDasharray?: string
    strokeLinecap?: string
    style?: CSSProperties
  }
  
  interface AnnotationProps {
    subject: [number, number]
    dx?: number
    dy?: number
    children?: ReactNode
    connectorProps?: Record<string, any>
  }
  
  export const ComposableMap: FC<ComposableMapProps>
  export const Geographies: FC<GeographyProps>
  export const Geography: FC<GeographyProps>
  export const Markers: FC<MarkersProps>
  export const Marker: FC<MarkerProps>
  export const Lines: FC<LinesProps>
  export const Line: FC<LineProps>
  export const Annotation: FC<AnnotationProps>
}
