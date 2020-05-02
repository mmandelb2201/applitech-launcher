package com.AppliTech;

import java.io.IOException;

public class Compiler {

	public static void main(String[] args){
		System.out.println("connected");
	}
	
	public static void run(String path){
		Runtime runTime = Runtime.getRuntime();
		
		try {
			runTime.exec(path);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
	
}
