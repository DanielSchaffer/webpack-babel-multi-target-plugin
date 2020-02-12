import React, { Suspense } from "react";

const OtherComponent = React.lazy(() => import('./LazyRoute'));

const Application = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <OtherComponent />
      </div>
    </Suspense>
  )
}