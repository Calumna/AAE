Pour que le projet fonctionne, il faut : 
- créer et lancer redis avec un docker sur le bon port : lancer la commande : "docker run -d -p 6379:6379 --name myredis --network redisnet redis"
- lancer le projet Java MessagerieBroker
- lancer le projet React messagerie-front
