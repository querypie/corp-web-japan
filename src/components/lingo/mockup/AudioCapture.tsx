interface AudioCaptureProps {
  capturing: boolean
  connected: boolean
}

export function AudioCapture({ capturing, connected }: AudioCaptureProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            connected ? "bg-success" : "bg-muted"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {capturing && (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm font-medium text-destructive">
            Recording
          </span>
        </div>
      )}
    </div>
  )
}
