var base64 = {
	toBase64Table: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
	base64Pad: '=',
	toBinaryTable: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ],
    utf16to8:function(str) {
		  var out, i, len, c;
		  out = "";
		  len = str.length;
		  for(i = 0; i < len; i++) {
		    c = str.charCodeAt(i);
		    if ((c >= 0x0001) && (c <= 0x007F)) {
		      out += str.charAt(i);
		    } else if (c > 0x07FF) {
		      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
		      out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
		      out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		    } else {
		      out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
		      out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		    }
		  }
		  return out;
	},
	utf8to16:function(str) {
		  var out, i, len, c;
		  var char2, char3;
		  out = "";
		  len = str.length;
		  i = 0;
		  while(i < len) {
		    c = str.charCodeAt(i++);
		    switch(c >> 4) {
		      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		        // 0xxxxxxx
		        out += str.charAt(i-1);
		        break;
		      case 12: case 13:
		        // 110x xxxx   10xx xxxx
		        char2 = str.charCodeAt(i++);
		        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		        break;
		      case 14:
		        // 1110 xxxx  10xx xxxx  10xx xxxx
		        char2 = str.charCodeAt(i++);
		        char3 = str.charCodeAt(i++);
		        out += String.fromCharCode(((c & 0x0F) << 12) |
		        ((char2 & 0x3F) << 6) |
		        ((char3 & 0x3F) << 0));
		        break;
		    }
		  }
		  return out;
	},
	toBase64: function (data) {
		data = base64.utf16to8(data);
		var result = '';
		var length = data.length;
		var i;
		// Convert every three bytes to 4 ascii characters.                                                   

		for (i = 0; i < (length - 2); i += 3) {
			result += this.toBase64Table[data.charCodeAt(i) >> 2];
			result += this.toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
			result += this.toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
			result += this.toBase64Table[data.charCodeAt(i + 2) & 0x3f];
		}

		// Convert the remaining 1 or 2 bytes, pad out to 4 characters.                                       

		if (length % 3) {
			i = length - (length % 3);
			result += this.toBase64Table[data.charCodeAt(i) >> 2];
			if ((length % 3) == 2) {
				result += this.toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
				result += this.toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
				result += this.base64Pad;
			} else {
				result += this.toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
				result += this.base64Pad + this.base64Pad;
			}
		}
		return result;
	},
	base64ToString: function (data) {
		var result = '';
		var leftbits = 0; // number of bits decoded, but yet to be appended    
		var leftdata = 0; // bits decoded, but yet to be appended   

		// Convert one by one.                                                                               
		for (var i = 0; i < data.length; i++) {
			var c = this.toBinaryTable[data.charCodeAt(i) & 0x7f];
			var padding = (data.charCodeAt(i) == this.base64Pad.charCodeAt(0));
			// Skip illegal characters and whitespace    
			if (c == -1) continue;

			// Collect data into leftdata, update bitcount    
			leftdata = (leftdata << 6) | c;
			leftbits += 6;

			// If we have 8 or more bits, append 8 bits to the result   
			if (leftbits >= 8) {
				leftbits -= 8;
				// Append if not padding.   
				if (!padding)
					result += String.fromCharCode((leftdata >> leftbits) & 0xff);
				leftdata &= (1 << leftbits) - 1;
			}

		}
		// If there are any bits left, the base64 string was corrupted                                        
		if (leftbits)
			throw Components.Exception('Corrupted base64 string');
		return base64.utf8to16(result);
	}
}

export default base64
