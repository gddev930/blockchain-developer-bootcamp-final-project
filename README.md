# blockchain-developer-bootcamp-final-project

## Decentralized Tote System Protocol (DTSP)

### OVERVIEW
DTSP is a protocol that enables users to bet into a pari-mutuel market, also commonly referred to as Tote markets.  
DTSP directly addressing massive shortcomings of the existing ITSP protocol that is preventing global liquidity sharing for current pari-mutuel market operators 

### WHAT DOES DTSP DO?
The protocol enables someone to create a market, link it to an event that will happen in the future and establish the bet structure (e.g. horse to win, horse to place, accumulator style).
The protocol also enables the market to accept wagers, share live betting data (e.g. total pool size and individual bets) with anyone who wants to observe, stop accepting wagers when the event starts and finally payout the market after the result is known.
This means that no individual is responsible for holding user’s money, all payout mechanisms are transparent before placing the bet and all users can see exactly what bets are being placed into the market (a privilege that is normally only reserved for large professional bettors). 

### HOW DOES IT WORK
There is one platform token called TOTE, however, all betting and payouts can happen in any token (e.g. BTC, ETH, USDC etc. and the native token TOTE).
  -	TOTE holders will be able to create a betting market
  -	All betting happens on-chain directly into a market with any token the user choses
  -	An oracle (or TOTE holder) will close and then settle the market
  -	The market will have a duration where it can be disputed
  -	The commission will be deducted from the pool and paid out to TOTE holders
  -	Payouts made to winners in accordance with the specific market’s schedule 
