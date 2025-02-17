import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const keystrokes = sqliteTable("keystrokes", {
  keystrokeId: text("keystroke_id").primaryKey(),
  timestamp: integer("timestamp").notNull(),
  keyCode: integer("key_code").notNull(),
  keyChar: text("key_char").notNull(),
});


const mousePositions = sqliteTable("mouse_positions", {
  mouseId: text("mouse_id").primaryKey(),
  timestamp: integer("timestamp").notNull(),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
});

export { keystrokes, mousePositions };
