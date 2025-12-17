import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/Redux/Store";
import { useTheme } from "./hooks/useTheme";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import BentoGrid from "./components/BentoGrid";
import SizeProvider from "./providers/SizeProvider";

export function AppContainer() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen min-w-screen bg-(--color-bg) text-(--color-text) transition-colors">
      <div className="max-w-2xl max-h-lg mx-auto py-8 px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bento Grid + Theme</h1>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>

      <main className="min-h-screen min-w-screen py-6 px-4">
        <SizeProvider BentoGrid={BentoGrid} />
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
