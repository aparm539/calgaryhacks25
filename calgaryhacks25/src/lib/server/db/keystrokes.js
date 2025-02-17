import { db } from "./client"; // Assuming you have a db instance
import { keystrokes, mousePositions } from "./schema";

// Keystrokes CRUD operations

export async function createKeystroke(
  sessionId: string,
  timestamp: number,
  keyCode: number,
  keyChar: string
) {
  await db.insert(keystrokes).values({
    sessionId,
    timestamp,
    keyCode,
    keyChar,
  });
}

export async function getKeystrokes(sessionId: string) {
  return await db
    .select()
    .from(keystrokes)
    .where(keystrokes.sessionId.eq(sessionId));
}

export async function updateKeystroke(
  keystrokeId: string,
  sessionId: string,
  timestamp: number,
  keyCode: number,
  keyChar: string
) {
  await db
    .update(keystrokes)
    .set({
      sessionId,
      timestamp,
      keyCode,
      keyChar,
    })
    .where(keystrokes.keystrokeId.eq(keystrokeId));
}

export async function deleteKeystroke(keystrokeId: string) {
  await db.delete(keystrokes).where(keystrokes.keystrokeId.eq(keystrokeId));
}

// MousePositions CRUD operations

export async function createMousePosition(
  sessionId: string,
  timestamp: number,
  xPosition: number,
  yPosition: number
) {
  await db.insert(mousePositions).values({
    sessionId,
    timestamp,
    xPosition,
    yPosition,
  });
}

export async function getMousePositions(sessionId: string) {
  return await db
    .select()
    .from(mousePositions)
    .where(mousePositions.sessionId.eq(sessionId));
}

export async function updateMousePosition(
  mouseId: string,
  sessionId: string,
  timestamp: number,
  xPosition: number,
  yPosition: number
) {
  await db
    .update(mousePositions)
    .set({
      sessionId,
      timestamp,
      xPosition,
      yPosition,
    })
    .where(mousePositions.mouseId.eq(mouseId));
}

export async function deleteMousePosition(mouseId: string) {
  await db.delete(mousePositions).where(mousePositions.mouseId.eq(mouseId));
}
