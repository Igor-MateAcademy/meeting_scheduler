import React from 'react';
import { Routes, Route } from 'react-router-dom';
import store, { StoreContext } from 'stores';

import { Booking, MeetingForm, PageNotFound } from 'containers';

const App = () => {
  return (
    <StoreContext.Provider value={store}>
      <Routes>
        <Route path="/" element={<MeetingForm />} />
        <Route path="booking/*" element={<Booking />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </StoreContext.Provider>
  );
};

export default App;
