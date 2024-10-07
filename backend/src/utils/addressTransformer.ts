import { ethers } from 'ethers';
import { bech32 } from 'bech32';
import { log } from 'console';

export class AddressTransformer {
    // public static bech32ToEIP55Hex(bech32Address: string): string | null {
    //     return converter('evmos').toHex(bech32Address);
    // }

    // public static eip55HexToBech32(eip55HexAddress: string): string | null {
    //     return converter('evmos').toBech32(eip55HexAddress);
    // }
    public static bech32ToEIP55Hex(bech32Address: string): string | null {
        console.log('bech32Address', bech32Address)
        try {
          // Decode the Bech32 address to get the data part
          const { prefix, words } = bech32.decode(bech32Address);
          const data = bech32.fromWords(words);
          // Convert the data to a hex string
          const hexAddress = Buffer.from(data).toString('hex');
          // Convert the hex string to a checksummed EIP-55 address
          return ethers.getAddress(hexAddress);
        } catch (error) {
          console.error('Error converting Bech32 to EIP55 Hex:', error);
          return null;
        }
    }

    public static transformDelegatorAddresses(json: any): any {
        if (typeof json === 'object' && json !== null) {
          if (Array.isArray(json)) {
            return json.map((item: any) => this.transformDelegatorAddresses(item));
          } else if (json.hasOwnProperty('delegator_address')) {
            json['delegator_address'] = this.bech32ToEIP55Hex(json['delegator_address']) || json['delegator_address'];
          }
          for (const key in json) {
            if (typeof json[key] === 'object') {
              this.transformDelegatorAddresses(json[key]);
            }
          }
        }
        return json;
    }

    public static eip55HexToBech32(eip55HexAddress: string): string | null {
        try {
          // Strip the '0x' prefix and ensure the address is 40 characters long
            let hexAddress = eip55HexAddress.slice(2);
            if (hexAddress.length < 40) {
                hexAddress = hexAddress.padStart(40, '0');
            }
            // Convert the hex string to a Uint8Array
            const bytes = ethers.toBeArray(hexAddress);
            // Convert the Uint8Array to Bech32 words
            const words = bech32.toWords(bytes);
            // Encode the words to Bech32
            return bech32.encode('evmos', words);
        } catch (error) {
            console.error('Error converting EIP55 Hex to Bech32:', error);
            return null;
        }
    }
}