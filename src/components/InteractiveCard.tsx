import { Card, type CardProps } from "@mui/material";

export function InteractiveCard({ children, className = "", sx = {}, ...props }: CardProps) {
  const stageClassName = `mouse-stage card-stage ${className}`.trim();

  return (
    <div className={stageClassName}>
      <Card className="interactive-card-surface" sx={{ overflow: "hidden", ...sx }} {...props}>
        {children}
      </Card>
    </div>
  );
}
