import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainGridContainer from "@Pages/MainGrid";
import { Provider } from "react-redux";
import { store } from "@Store/Redux/Store";

function App() {
  return (
    <div className="h-full w-full">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {/* <Route exact path="/:id/view" component={DetailPage} />
          <Route exact path="/:id/edit" component={EditPage} /> */}
            <Route path="/" element={<MainGridContainer />} />
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
