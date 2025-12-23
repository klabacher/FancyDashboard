import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/Redux/Store";
// import { useTheme } from "./hooks/useTheme";
// import { ThemeSwitcher } from "./components/ThemeSwitcher";
// import BentoGrid from "@components/GridStuff/BentoGrid";
// import SizeProvider from "./components/GridStuff/SizeProvider";
// import { useRef } from "react";
import AppContainer from "./pages/MainPage";

// export function AppContainer() {
//   const { theme, setTheme } = useTheme();

//   const divRef = useRef<HTMLDivElement>(null);

//   return (
//     <div className="h-screen w-screen bg-(--color-bg) text-(--color-text) transition-colors flex flex-col overflow-hidden">
//       <div className="max-w-2xl max-h-lg mx-auto py-8 px-4 flex items-center justify-between">
//         <ThemeSwitcher theme={theme} setTheme={setTheme} />
//       </div>

//       <main ref={divRef} className="flex-1 w-full min-h-0 relative px-4 pb-4">
//         <SizeProvider mainDivRef={divRef} BentoGrid={BentoGrid} />
//       </main>
//     </div>
//   );
// }

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
