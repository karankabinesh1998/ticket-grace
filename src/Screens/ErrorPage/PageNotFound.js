import React from 'react';

export default function PageNotFound() {
  return (
    <React.Fragment>
      <div class="loader"></div>
      <div id="app">
        <section class="section">
          <div class="container mt-5">
            <div class="page-error">
              <div class="page-inner">
                <h1>404</h1>
                <div class="page-description">
                  The page you were looking for could not be found.
                </div>
                <div class="page-search">
                   <div class="mt-3">
                    <a href="/">Back to Home</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}
