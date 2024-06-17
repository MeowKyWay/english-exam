cat hard.txt | sed -nE '
	:start
	
	/^[0-9]/ {
		s/^([0-9]+)+[. ]*([^$]*)/\1\t\2/
		H
		n

		:loop

		/^[A-Z]/ {
			s/^[A-Z][. ]*([^$]*)/\1/
			H
			n
		}

		/^[A-Z]/ {
			b loop
		}

		x
		s/^\n//g
		s/\n/\t/g
		p
		s/.*//
		x
	}
	
	b start
'