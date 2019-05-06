#load "graphics.cma" ;;
open Graphics ;;
open_graph "";;

set_color red;;

let rec mout((x,y) : int*int)((u,v): int*int)(n : int) =
	match n with                                            
	| 0 -> moveto x y ; lineto u v;                         
	| r -> let m = ((x+u)/2 ,(y+v)/2 + (Random.int 10*n)) in
	mout (x,y) (m) (r - 1);mout (m) (u,v) (r - 1);;     


mout (100,150) (500,150) (5);;  

set_color blue;;

let rec drag((x,y) : int*int)((u,v): int*int)(n : int) =   
	match n with                                               
	| 0 -> moveto x y ; lineto u v;                            
	| r -> let m = ((u+x)/2 - (v - y)/2,(v+y)/2 + (u - x)/2) in
	drag (x,y)(m)(r - 1);drag (u,v)(m) (r - 1);;      

drag (150,150) (350,350) (19) ;;

set_color black;;

let rotation((x,y) : int*int)(a : float) =
	let  u = float_of_int x and v = float_of_int y in
		(int_of_float(cos(a)*. u -. sin(a) *. v),int_of_float(sin(a)*. u +. cos(a) *. v));;

let rec koch((x,y) : int*int)((u,v): int*int)(n : int) =   
	match n with                                               
	| 0 -> moveto x y ; lineto u v;                            
	| r -> 
	let (z,t) = ((u - x)/3, (v - y)/3)  in
		let (h,j) =  rotation(z,t)(acos(-1.)/.3.) in
			koch (x,y)(z+x,y+t)(r - 1);koch (z+x,y+t)(z+x+h,y+t+j) (r - 1);
			koch (z+x+h,y+t+j) (u-z,v-t) (r - 1);koch (u-z,v-t) (u,v) (r - 1);;

koch (150,150) (350,350) (1) ;;


let kochStar((x,y) : int*int)((u,v): int*int)(n : int) =
	let (z,t)  = rotation(u-x,v-y)(-.2.*.acos(-1.)/.3.) in
		koch(x,y)(u,v)(n); koch(u,v)(u+z,v+t)(n); koch(u+z,v+t)(x,y)(n);;


kochStar (150,150) (350,350) (5) ;;

