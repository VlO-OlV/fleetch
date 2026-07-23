terraform {
  backend "s3" {
    key = "terraform/terraform.tfstate"
    bucket = "fleetch-s3-bucket"
    region = "eu-central-1"
    access_key = ""
    secret_key = ""
  }
}  