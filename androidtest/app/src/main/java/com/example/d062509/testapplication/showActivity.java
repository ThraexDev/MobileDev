package com.example.d062509.testapplication;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.TextView;

public class showActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show);
        Intent intent = getIntent();
        String message = intent.getStringExtra("SEND");
        TextView textView = (TextView) findViewById(R.id.textView3);
        textView.setTextSize(40);
        textView.setText(message);
    }
}
