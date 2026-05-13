import { useActionState } from "react";
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import { site } from "../config.js";
import { InteractiveCard } from "./InteractiveCard.js";

interface FormState {
  errors: Record<string, string>;
  note: string;
}

const topicOptions = [
  "Software opportunity",
  "Software engineering role",
  "Systems engineering role",
  "Technical program management role",
  "Technical project or collaboration",
  "General intro",
];

const initialState: FormState = {
  errors: {},
  note: "Share role, team, and technical scope for a faster reply.",
};

function submitAction(_prev: FormState, data: FormData): FormState {
  const name = (data.get("name") as string | null) ?? "";
  const email = (data.get("email") as string | null) ?? "";
  const message = (data.get("message") as string | null) ?? "";
  const topic = (data.get("topic") as string | null) ?? topicOptions[0];

  const errors: Record<string, string> = {};
  if (!name.trim()) errors.name = "A name helps.";
  if (!email.trim()) {
    errors.email = "An email is needed.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "That email format looks off.";
  }
  if (!message.trim() || message.trim().length < 14) {
    errors.message = "Please add a bit more detail.";
  }

  if (Object.keys(errors).length) {
    return { errors, note: "Please fix the highlighted fields." };
  }

  const subject = `${topic} inquiry from ${name}`;
  const body = ["Hi Will,", "", message, "", `Name: ${name}`, `Email: ${email}`, `Topic: ${topic}`].join(
    "\n"
  );
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { errors: {}, note: "Your email app should open a draft. If needed, email me directly." };
}

export function ContactFormCard() {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);

  return (
    <InteractiveCard className="contact-form-card" sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={2.2}>
        <Box>
          <Chip label="Start the conversation" variant="outlined" color="secondary" sx={{ mb: 1.5 }} />
          <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif' }}>
            Open a prefilled email draft.
          </Typography>
        </Box>
        <form action={formAction}>
          <Stack spacing={1.4}>
            <div className="form-grid">
              <TextField
                label="Name"
                name="name"
                error={Boolean(state.errors.name)}
                helperText={state.errors.name || " "}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                error={Boolean(state.errors.email)}
                helperText={state.errors.email || " "}
              />
            </div>
            <TextField
              select
              label="What are you reaching out about?"
              name="topic"
              defaultValue={topicOptions[0]}
              slotProps={{ select: { native: true } }}
            >
              {topicOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </TextField>
            <TextField
              label="What would you like to discuss?"
              name="message"
              multiline
              minRows={5}
              error={Boolean(state.errors.message)}
              helperText={state.errors.message || "Share role, team, or project."}
            />
            <Stack direction="row" flexWrap="wrap" gap={1.2}>
              <Button variant="contained" type="submit" disabled={isPending}>
                Create draft -&gt;
              </Button>
              <Button variant="outlined" href={`mailto:${site.email}`}>
                Email directly
              </Button>
            </Stack>
          </Stack>
        </form>
        <Paper
          variant="outlined"
          sx={{ p: 1.5, borderRadius: "18px", bgcolor: "rgba(255,255,255,0.04)" }}
        >
          <Typography color="text.secondary">{state.note}</Typography>
        </Paper>
      </Stack>
    </InteractiveCard>
  );
}
