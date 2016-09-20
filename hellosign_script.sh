curl -v 'https://api.hellosign.com/v3/signature_request/create_embedded' \                                                                                           e-signature
-u '37ae83ca985ec0a297cdf1bb2482f4db078634d8a69da5b48629172b61a4e4cc:' \
  -F 'client_id=b03d1fce1eabf3d0906523817135acbd' \
  -F 'subject=My First embedded signature request' \
  -F 'message=Awesome, right?' \
  -F 'signers[0][email_address]=gabeharms@gmail.com' \
  -F 'signers[0][name]=Gabe Harms' \
  -F 'file[0]=@NDA.pdf' \
  -F 'test_mode=1'

curl 'https://api.hellosign.com/v3/embedded/sign_url/497a1e81e523587a140762eefe40b980' \                                                                             e-signature
    -u '37ae83ca985ec0a297cdf1bb2482f4db078634d8a69da5b48629172b61a4e4cc:'
