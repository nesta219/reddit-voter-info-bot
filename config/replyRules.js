let botFooter = `

**If you have more questions, please visit https://votespa.com or call the toll-free PA Voter Assistance Hotline: 1-833-PA-VOTES (1-833-728-6837)**

^^I ^^am ^^a ^^bot ^^here ^^to ^^help ^^PA ^^voters ^^get ^^the ^^info ^^they ^^need ^^for ^^the ^^2020 ^^election!
^^Problem?  ^^Please ^^send ^^me ^^a ^^pm
`;

let voteByMailReply =
`**All registered voters in PA can now vote by mail, no excuse needed!**

The process is easy:

**Step 1: Request the Ballot**
  1) Sign up for a mail ballot online at https://votespa.com/applymailballot
  2) Please note that you will be asked for a PA Driver's license or PennDOT ID to sign up online.  If you do not have this, you can also use the last 4 digits of your SSN.
  3) Requests for mail ballots must be received by the County Board of Elections by **5:00pm the Tuesday before Election Day: October 27**.
  
**Step 2: Complete the Ballot**
  1) Mark the mail ballot, following the instructions
  2) Place the completed ballot in the secrecy envelope and then put the secrecy envelope into the second larger envelope with the declaration printed on it.  It cannot be emphasized enough that you **follow the instructions for the secrecy envelop**!  If you do not include it, **YOUR VOTE WILL NOT COUNT**.
  3) Be sure to sign the declaration and use the secrecy envelope or the ballot **will not count**

**Step 3: Deliver the Ballot**
- **Option A: Return the ballot in person**
  1) Deliver the ballot in person to your County Board of Elections, or a dropbox set up by your County, **by 8:00pm on November 3rd**

- **Option B: Return the ballot by mail**
  1) Mail the ballot to your County Board of Elections
  2) Ballots must be postmarked by Election Day, Tuesday November 3rd.  Place your ballot in the mail as soon as you can.
  
**If you do not return your voted mail-in ballot by the deadline and you want to vote in person, you have two options:**
  1) Bring your ballot and **ALL INCLUDED ENVELOPES INCLUDING THE SECRECY ENVELOPE** to your polling place and turn it in so you can vote on your county’s voting system.
  2) If you don’t have your ballot, you can still vote by [provisional ballot](https://www.votespa.com/Voting-in-PA/Pages/Voting-by-Provisional-Ballot.aspx) at your polling place.
  
Check your ballot status by going to https://www.votespa.com/mailballotstatus 
` + botFooter;

let earlyVotingReply =
`**You can vote early in-person in Pennsylvania!**

Starting this fall through​ October 27 at 5:00PM​, voters in Pennsylvania can vote early by going to their county elections office in person, requesting a mail-in ballot, completing it on the spot, and handing it right back. ​Don’t forget​: place your completed ballot in the smaller secrecy envelope; place the smaller envelope in the larger return envelope; complete and sign the voter's declaration on the larger envelope to ensure your vote will be counted.

**Where can I vote early?**

Voters can go to their ​county board of elections office​ to vote early in person during operational hours. Additionally, counties may open satellite county elections offices. To find out the hours of operation and if your county has opened additional locations, ​please call your county elections office​.  You can look up the phone number at ​https://votespa.com/county​

**Before You Go**

Call your county elections office ​to make sure ballots are final and ready to be printed for you​. Also, make sure your county hasn’t already mailed it to you by checking the status of your mail ballot request at ​https://votespa.com/mailballotstatus​

**What if I'm not registered yet?**

For voters needing to register, you can go to your county election office to first register and then immediately request a ballot, all in one visit. ​Don’t forget​, the deadline to register to vote is ​October 19​.  Check your voter registration status here: https://votespa.com/status

**What if I already applied to Vote By Mail?**

For voters who have already applied to vote by mail, instead of waiting for your ballot to be mailed to you, you can go​​ to your county elections office to request a mail-in ballot in person to vote early on the spot. If you receive a ballot in the mail after having voted early, in person, that second ballot should be destroyed.
` + botFooter;

let provisionalBallotReply =
`**What is a Provisional Ballot?**

A [https://www.votespa.com/Voting-in-PA/Pages/Voting-by-Provisional-Ballot.aspx](Provisional Ballot) is a paper ballot provided to a voter upon request in person, at a polling place, on Election Day. Official Poll Workers should never turn away a voter without offering the option of voting on a provisional ballot.

**When to Vote by Provisional Ballot**
- If you applied to vote by mail and are unable to return your mailed ballot to your county board of elections office by 8pm on Election Day
- If you believe you are a duly-registered Pennsylvania voter, but do not appear on the poll books at that polling place - whether it is your correct polling location or not.
- If you are voting at a polling place for the first time and don’t have an approved form of ID (photo or non-photo)
- In the event that someone challenges your right to vote and you do not produce a witness affirming your identity

**How to Vote by Provisional Ballot**

- **Request** the ballot and ballot instructions from an Official Poll Worker who must provide: the ballot; a secrecy envelope; an outer provisional ballot envelope; and a private, accessible place to mark the ballot
- **Mark** the ballot according to the instructions of the polling place and **sign** the affirmation on the reverse side of the ballot
- **Insert** the completed ballot into the secrecy envelope and **seal** the inner envelope - Insert the secrecy envelope with the completed ballot into the outer provisional ballot envelope, **seal**, **complete** and **sign** the voter declaration on the outer envelope and return it to the Official Poll Worker
- **Request** and keep your provisional ballot identification receipt, which you can use to verify if your vote was counted by either using the online tracker at https://votespa.com/provisional or calling your county board of election office within 7 days
after the election.
` + botFooter;


let ballotStatus =
`**What is my PA vote-by-mail ballot status?**
"Pending" status in the PA online ballot tracker (https://www.votespa.com/mailballotstatus) means that your application has been received and processed but the completed ballot hasn't yet been processed.  If the application has not been received and processed, the system will return no information for the voter. Once received and processed, the status of the mail-in ballot will be "pending".  When the ballot has been mailed out (or once the county creates a mailing label), the system will show that date.  It will also be updated once your ballot is received.
` + botFooter;

module.exports = {
  subreddits: [
      {
          "name": "testingground4bots"
      },
      {
          "name": "philadelphia"
      },
      {
          "name": "pittsburgh"
      },
      {
          "name": "pennsylvania"
      },
      {
          "name": "pennstateuniversity"
      },
      {
          "name": "pitt"
      },
      {
          "name": "drexel"
      },
      {
          "name": "temple"
      }
  ],
  rules: [
      {
          "category": "vbm_standard",
          "keywords": [
              "vote", "mail"
          ],
          "reply": voteByMailReply
      },
      {
          "category": "vbm_standard",
          "keywords": [
              "voting", "mail"
          ],
          "reply": voteByMailReply
      },
      {
          "category": "vbm_standard",
          "keywords": [
              "mail", "ballot"
          ],
          "reply": voteByMailReply
      },
      {
          "category": "vbm_standard",
          "keywords": [
              "absentee", "ballot"
          ],
          "reply": voteByMailReply
      },
      {
          "category": "early_standard",
          "keywords": [
              "early", "voting"
          ],
          "reply": earlyVotingReply
      },
      {
          "category": "early_standard",
          "keywords": [
              "early", "vote"
          ],
          "reply": earlyVotingReply
      },
      {
          "category": "early_standard",
          "keywords": [
              "early", "voting", "in", "person"
          ],
          "reply": earlyVotingReply
      },
      {
          "category": "early_standard",
          "keywords": [
              "early", "vote", "in", "person"
          ],
          "reply": earlyVotingReply
      },
      {
          "category": "early_standard",
          "keywords": [
              "provisional", "ballot"
          ],
          "reply": provisionalBallotReply
      },
      {
          "category": "status",
          "keywords": [
              "mail", "ballot", "pending"
          ],
          "reply": ballotStatus
      },
      {
          "category": "status",
          "keywords": [
              "mail", "ballot", "status"
          ],
          "reply": ballotStatus
      }
  ]
};