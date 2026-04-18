# Router working in the project

- api/v1/problems/ping
  - because the route starts with /api -> apiRouter
  - then /v1 -> v1Router
  - then /problems -> problemRouter
  - then /ping -> problemController.pingProblemController
    apiRouter -> v1Router -> problemRouter -> problemController -> service layer
 