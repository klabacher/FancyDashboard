import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/Redux/Store";
import { useTheme } from "./hooks/useTheme";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import ResizableHandles from "./components/BentoGrid";

export function AppContainer() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text) transition-colors">
      <div className="max-w-6xl mx-auto py-8 px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bento Grid + Theme</h1>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>

      <main className="py-6 px-4">
        <ResizableHandles />
      </main>
    </div>
  );
}

function App() {
  return (
    <div className="h-full w-full">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppContainer />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
