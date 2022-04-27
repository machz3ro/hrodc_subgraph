import {
  Transfer as TransferEvent,
  Token as TokenContract
} from "../generated/Token/Token"
import {
  Token, User
} from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  // Load HroDC Token Contract from the graph node
  let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    // New HroDC Token ID loaded created at timestamp
    token = new Token(event.params.tokenId.toString());
    token.creator = event.params.tokenId.toHexString();
    token.tokenID = event.params.tokenId;
    token.createdAtTimestamp = event.block.timestamp;
    // Call to HroDC Token contract get the metadata
    let tokenContract = TokenContract.bind(event.address);
    token.contentURI = tokenContract.tokenURI(event.params.tokenId);
    token.metadataURI = tokenContract.tokenMetadataURI(event.params.tokenId);
  }
  // Set the HroDC Token Owner
  token.owner = event.params.to.toHexString();
  token.save();
  // Check if the address is valid
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
