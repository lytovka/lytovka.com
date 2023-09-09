import type { PropsWithChildren } from "react";
import { useState } from "react";
import MainLayout from "~/components/main-layout";
import { DraggingContext, MovableComponent } from "~/components/movable";

export const DraggingProvider = ({ children }: PropsWithChildren) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  return (
    <DraggingContext.Provider value={{ draggingItem, setDraggingItem }}>
      {children}
    </DraggingContext.Provider>
  );
};

export default function TestPage() {
  return (
    <MainLayout>
      <DraggingProvider>
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
          <MovableComponent id="item1" />
          {/* <MovableComponent id="item2" /> */}
        </div>
      </DraggingProvider>
    </MainLayout>
  );
}
